import { Request, Response } from 'express';
import GithubService from '../services/github.service';
import { ErrorHandler } from '../utils/apiError';
import { prismaClient } from '../client';
import ProjectService from '../services/project.service';
export const fetchRepositories = async (req: Request, res: Response) => {
  // if (req.user.provider !== 'github') {
  //   return res.status(400).json({ error: 'You are not a github user' });
  // }
  // try {
  //   const repositories = await GithubService.repositories(
  //     req.user.githubAccessToken as string
  //   );
  //   res.status(200).json({ repositories });
  // } catch (error: any) {
  //   ErrorHandler(error, res);
  // }
};

export const setupWebhook = async (req: Request, res: Response) => {
  if (req.user.provider !== 'github') {
    return res.status(400).json({ error: 'You are not a github user' });
  }
  const { repoName } = req.body;
  if (!repoName) return res.status(400).json({ error: 'provide repo name' });
  try {
    console.log(req.user);
    const webhook = await GithubService.setupWebhook(
      req.user.githubAccessToken as string,
      repoName,
      req.user.githubUsername as string
    );
    res.status(200).json('SENDED');
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  const body = req.body;
  const signature = req.headers['x-hub-signature-256'] as string;
  const valid = GithubService.verifyWebhookSecret(signature, body);
  if (!valid) return res.status(400).json({ error: 'Invalid signature' });

  let repoUrl: string;
  if (req.body.svn_url) {
    repoUrl = req.body.svn_url;
  } else if (req.body.clone_url) {
    repoUrl = req.body.clone_url.split('.git')[0];
  } else {
    return res
      .status(400)
      .json({ error: 'Missing repository URL (svn_url or clone_url)' });
  }

  let username: string;
  if (req.body.repository) {
    username = req.body.repository.owner.login;
  } else {
    return res
      .status(400)
      .json({ error: 'Missing repository owner information' });
  }

  try {
    const projects = await prismaClient.project.findMany({
      where: {
        repo: repoUrl,
        user: {
          githubUsername: username,
        },
      },
      include: {
        user: {
          select: {
            githubAccessToken: true,
          },
        },
      },
    });
    if (!projects || projects.length === 0) return;

    for (const project of projects) {
      await ProjectService.createDeployment({
        projectId: project.id,
        user: {
          id: req.user.id,
          githubUsername: req.user.githubUsername as string,
          githubAccessToken: req.user.githubAccessToken as string,
        },
      });
    }
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
