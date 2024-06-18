import { config } from '../config/production';
import ApiError from '../utils/apiError';
import httpStatus from 'http-status';
import { createHmac, timingSafeEqual } from 'crypto';
class GithubService {
  public static async repositories(accessToken: string) {
    if (!accessToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing access token');
    }
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const repos = await response.json();

    return repos;
  }

  public static async setupWebhook(
    accessToken: string,
    repoName: string,
    ownerName: string
  ) {
    if (!accessToken || !repoName || !ownerName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing fields');
    }
    const response = await fetch(
      `https://api.github.com/repos/${ownerName}/${repoName}/hooks`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push'],
          config: {
            url: config.WEBHOOK.URL,
            content_type: 'json',
            secret: config.WEBHOOK.SECRET,
          },
        }),
      }
    );
    const data = await response.json();
    console.log(data);
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
}
export default GithubService;
