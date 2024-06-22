import { Request, Response } from 'express';
import GithubService from '../services/github.service';
import { ErrorHandler } from '../utils/apiError';
import AuthService from '../services/auth.service';
export const fetchRepositories = async (req: Request, res: Response) => {};

export const webhookHandler = async (req: Request, res: Response) => {
  const body = req.body;
  const signature = req.headers['x-hub-signature-256'] as string;
  const valid = GithubService.verifyWebhookSecret(signature, body);
  if (!valid) return res.status(400).json({ error: 'Invalid signature' });
  const event = req.headers['x-github-event'];
  try {
    if (event === 'installation') {
      const installationId = body.installation.id;
      const username = body.installation.account.login;
      if (body.action === 'created') {
        await GithubService.handleNewInstallation(installationId, username);
      } else if (body.action === 'deleted') {
        await GithubService.handleUninstallation(installationId, username);
      }
    } else if (event === 'push' && body.ref === 'refs/heads/main') {
      // Handle Redeployment
      const repo = body.repository.name;
      const username = body.repository.owner.login;
      await GithubService.handleReDeployment(repo, username);
    }
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const connectToGithub = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    if (req.user.githubUsername) {
      return res.status(403).json({ error: 'Github account already exists' });
    }
    await AuthService.connectGithub(req.user.id, code);
    res.status(200).json({ message: 'Github account connected' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const configuredRepositories = async (req: Request, res: Response) => {
  if (!req.user.installationId)
    return res.status(400).json({ error: 'Installation not found' });
  console.log(req.user.installationId);
  try {
    const accessToken = await GithubService.getInstallationAccessToken(
      req.user.installationId
    );
    if (!accessToken)
      return res
        .status(400)
        .json({ error: 'Error getting installation access token' });
    console.log(accessToken);
    const repositories = await GithubService.getInstallationRepositories(
      accessToken
    );
    console.log('REPOS');
    console.log(repositories);

    res.status(200).json({ repositories });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
