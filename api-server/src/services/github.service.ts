import { config } from '../config/production';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { createHmac, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import qs from 'qs';
import UserService from './user.service';
import { prismaClient } from '../client';
import ProjectService from './project.service';

class GithubService {
  /* In order to authenticate as an app or generate an installation access token,
  you must generate a JSON Web Token (JWT) */
  public static generateJwt() {
    const privateKey = fs.readFileSync(
      path.resolve(__dirname, '../../github-app.pem'),
      'utf-8'
    );
    const appId = config.GITHUB.APP_ID;
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now,
      exp: now + 60 * 10,
      iss: appId,
    };
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    return token;
  }
  /* Lists all the installations for this Github app using the JWT Token.  */
  public static async installations(jwtToken: string) {
    if (!jwtToken)
      throw new ApiError(httpStatus.BAD_REQUEST, 'provide access token');
    const rootUrl = `https://api.github.com/app/installations`;
    const headers = {
      Authorization: `token ${jwtToken}`,
      Accept: 'application/vnd.github.v3+json',
    };
    const { data } = await axios.get(rootUrl, {
      headers,
    });

    return data;
  }
  public static async repoCommits(
    repo: { author: string; name: string },
    accessToken: string
  ) {
    const rootUrl = `https://api.github.com/repos/${repo.author}/${repo.name}/commits`;
    const { data } = await axios.get(rootUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    return data;
  }
  /* Lists particular installation for this Github app using the JWT Token.  */
  public static async installationById(id: number, jwtToken: string) {
    if (!jwtToken || !id)
      throw new ApiError(httpStatus.BAD_REQUEST, 'provide jwt token & id');

    const rootUrl = `https://api.github.com/app/installations/${id}`;
    const headers = {
      Authorization: `token ${jwtToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    const { data } = await axios.get(rootUrl, {
      headers,
    });
    return data;
  }

  /* Generate's a new PAT & refreh token by using current active refresh token.  */
  public static async refreshToken(refresh_token: string) {
    const rootUrl = 'https://github.com/login/oauth/access_token';

    const options = {
      client_id: config.GITHUB.CLIENT_ID,
      client_secret: config.GITHUB.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token,
    };

    const query = qs.stringify(options);

    const { data } = await axios.post(`${rootUrl}?${query}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const decoded = qs.parse(data);
    return decoded as { access_token: string; refresh_token: string };
  }
  /* To get installation details (e.g. repositories), an access token must be generated.
  The following method will return the access token by using the jwt token generated above.
  */
  public static async getInstallationAccessToken(installationId: number) {
    const jwtToken = this.generateJwt();

    const apiUrl = `https://api.github.com/app/installations/${installationId}/access_tokens`;

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    try {
      const { data } = await axios.post(apiUrl, {}, { headers });
      return data.token;
    } catch (error: any) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Error fetching installation access token: ${error.message}`
      );
    }
  }
  // Returns all the repositories of a particular installation by using the access token generated from above method
  public static async getInstallationRepositories(accessToken: string) {
    if (!accessToken)
      throw new ApiError(httpStatus.BAD_REQUEST, 'provided access token');

    const { data } = await axios.get(
      'https://api.github.com/installation/repositories',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  }

  public static async verifyWebhookSecret(signature: string, body: string) {
    const SECRET = config.WEBHOOK.SECRET as string;

    const payload = JSON.stringify(body);

    const computedSignature = `sha256=${createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex')}`;
    if (
      timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
    ) {
      console.log('Payload verified successfully');
      return true;
    } else {
      console.error('Invalid payload or signature');
      return false;
    }
  }

  // Checks if the access token is valid if not creates a new access token and returns
  public static async handleAccessToken(accessToken: string, userId: string) {
    try {
      await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return accessToken;
    } catch (error: any) {
      const user = await UserService.findById(userId);
      if (!user || !user.githubAppToken)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid access token');
      const token = await this.refreshToken(user.githubAppToken);
      if (!token.access_token)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid access token');
      await UserService.update(user.id, {
        githubAccessToken: token.access_token,
        githubAppToken: token.refresh_token,
      });
      return token.access_token;
    }
  }
  public static async handleNewInstallation(
    installationId: number,
    username: string
  ) {
    const user = await UserService.findByGithubUsername(username);
    if (!user) return;
    return await UserService.update(user.id, {
      installationId,
    });
  }
  public static async handleUninstallation(
    installationId: number,
    username: string
  ) {
    const user = await UserService.findByGithubUsername(username);
    if (!user) return;
    return await UserService.update(user.id, {
      installationId: null,
    });
  }

  public static async handleReDeployment(
    repo: string,
    username: string,
    commitHash: string
  ) {
    const projects = await prismaClient.project.findMany({
      where: {
        repo: repo,
        deploymentMethod: 'git',
        user: {
          githubUsername: username,
        },
      },
      include: {
        user: {
          select: {
            githubAccessToken: true,
            id: true,
            githubAppToken: true,
          },
        },
      },
    });
    if (!projects || projects.length === 0) return;
    for (const project of projects) {
      await ProjectService.createDeployment({
        projectId: project.id,
        commitHash,
        user: {
          id: project.user.id,
          githubUsername: username,
          githubAccessToken: project.user.githubAccessToken,
        },
      });
    }
  }
}
export default GithubService;
