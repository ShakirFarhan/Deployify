import { GitHubUserPayload, User } from '../types/user.type';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import UserService from './user.service';
import { encryptPassword } from '../utils/encryption';
import { sendVerificationToken, signToken, verifyToken } from '../utils/token';
import { randomBytes, randomUUID } from 'crypto';
import { config } from '../config/production';
import axios from 'axios';
import qs from 'qs';
import { prismaClient } from '../client';
class AuthService {
  public static async login(data: Pick<User, 'email' | 'password'>) {
    const { email, password } = data;
    if (!email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');
    }
    const emailExist = await UserService.findByEmail(email);
    if (!emailExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    if (emailExist.provider !== 'local') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Login using ${emailExist.provider}`
      );
    }
    const hashedPassword = encryptPassword(password, emailExist.salt as string);
    if (emailExist.password !== hashedPassword)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect Password');

    if (!emailExist.verified) {
      // return Send verification token to mail
      await sendVerificationToken({
        email: emailExist.email,
        id: emailExist.id,
      });
      return { messsage: 'A mail was sent successfully, Please verify' };
    }
    const token = signToken({
      email: emailExist.email,
      id: emailExist.id,
      tokenType: 'access',
    });

    return {
      token,
      user: {
        id: emailExist.id,
        email: emailExist.email,
        role: emailExist.role,
      },
    };
  }

  public static async register(
    data: Pick<User, 'email' | 'password' | 'fullName'>
  ) {
    const { email, password, fullName } = data;
    if (!email || !password || !fullName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');
    }
    if (password.length < 8) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Password must be at least 8 characters long'
      );
    }
    const emailExist = await UserService.findByEmail(data.email);
    if (emailExist)
      throw new ApiError(httpStatus.CONFLICT, 'Email already Exists');
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = encryptPassword(data.password, salt);

    const user = await UserService.create({
      ...data,
      password: hashedPassword,
      salt,
      provider: 'local',
    });
    await sendVerificationToken({ email: user.email, id: user.id });
    return 'A mail was sent successfully, Please verify';
  }
  public static async verifyEmail(token: string) {
    const { id, tokenType } = verifyToken(token);

    if (tokenType !== 'verification' || !id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
    }

    const user = await UserService.findById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.verified) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
    }
    await UserService.update(user.id, { verified: true });

    const accessToken = signToken({
      email: user.email,
      id: user.id,
      tokenType: 'access',
    });
    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
  // hit the below api to get the code
  // https://github.com/login/oauth/authorize?client_id=bb82fa7bb334e4529f06
  private static async getGithubOAuthToken(code: string) {
    const rootUrl = 'https://github.com/login/oauth/access_token';
    const options = {
      client_id: config.GITHUB.CLIENT_ID,
      client_secret: config.GITHUB.CLIENT_SECRET,
      code,
    };

    const query = qs.stringify(options);

    const { data } = await axios.post(`${rootUrl}?${query}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const decoded = qs.parse(data) as {
      access_token: string;
      refresh_token: string;
    };

    return decoded;
  }

  private static async getGithubUser(access_token: string) {
    const { data } = await axios.get(`https:api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
  }
  // Github OAuth/Authentication
  public static async githubOAuth(code: string) {
    if (!code) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Authorization Code not Provided.'
      );
    }

    try {
      const { access_token, refresh_token } = await this.getGithubOAuthToken(
        code
      );

      const { email, avatar_url, login, name, id } = (await this.getGithubUser(
        access_token
      )) as GitHubUserPayload;
      const userExists = await UserService.findByEmail(email);

      let user: any;
      if (!userExists) {
        user = await UserService.create({
          fullName: name,
          githubUsername: login,
          email,
          password: randomUUID(),
          provider: 'github',
          verified: true,
          githubAccessToken: access_token,
          githubAppToken: refresh_token,
        });
      } else {
        if (userExists.provider !== 'github') {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Login using ${userExists.provider}`
          );
        }
        user = await prismaClient.user.update({
          where: {
            id: userExists.id,
          },
          data: {
            githubAccessToken: access_token,
            githubAppToken: refresh_token,
          },
          select: {
            id: true,
            email: true,
            role: true,
            verified: true,
            githubUsername: true,
          },
        });
      }

      const token = signToken(
        { id: user.id, email: user.email, tokenType: 'access' },
        '20d'
      );
      return {
        token,
        user,
      };
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  }
  // Used to connect an existing account to github
  public static async connectGithub(userId: string, code: string) {
    if (!userId || !code)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');

    try {
      const { access_token, refresh_token } = await this.getGithubOAuthToken(
        code
      );
      const { login } = (await this.getGithubUser(
        access_token
      )) as GitHubUserPayload;

      const githubUser = await UserService.findByGithubUsername(login);
      if (githubUser)
        throw new ApiError(httpStatus.CONFLICT, 'Github user already exists');
      await UserService.update(userId, {
        githubUsername: login,
        githubAccessToken: access_token,
        githubAppToken: refresh_token,
      });
    } catch (error: any) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
export default AuthService;
