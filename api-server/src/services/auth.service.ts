import { User } from '../types/user.type';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import UserService from './user.service';
import { encryptPassword } from '../utils/encryption';
import { sendVerificationToken, signToken, verifyToken } from '../utils/token';
import { randomBytes } from 'crypto';
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
    console.log('HERE');
    console.log(emailExist.verified);
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
    return { message: 'Email verified successfully' };
  }
}
export default AuthService;
