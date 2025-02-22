import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/apiError';
import ProjectService from '../services/project.service';
import { EnvVariables } from '../types/project.types';
import { config } from '../config/production';
import eventEmitter from '../utils/eventEmitter';
import SentEventService from '../services/sse.service';
import GithubService from '../services/github.service';
export const createProject = async (req: Request, res: Response) => {
  let {
    name,
    subDomain,
    buildCommand,
    outputDir,
    repo,
    envData,
    deploymentMethod,
  } = req.body;
  try {
    // Creating a new project
    const project = await ProjectService.create({
      name,
      subDomain,
      buildCommand,
      outputDir,
      repo,
      userId: req.user.id,
      deploymentMethod,
    });
    if (!project) res.status(400).json({ error: 'Error creating project' });
    // If environment variables exist then add them to the project
    if (envData) {
      await ProjectService.addEnviromentVariables({
        userId: req.user.id,
        projectId: project.id,
        enviromentVariables: envData,
      });
      envData = envData.map((env: EnvVariables) => {
        return {
          name: env.key,
          value: env.value,
        };
      });
    }
    let commitHash;
    if (project.deploymentMethod === 'git') {
      let commits = await GithubService.repoCommits(
        { author: req.user.githubUsername as string, name: repo },
        await GithubService.handleAccessToken(
          req.user.githubAccessToken as string,
          req.user.id
        )
      );
      console.log(commits);
      commitHash = commits[0].sha;
    }
    console.log(commitHash);
    // Creating a deployment for the project
    const deployment = await ProjectService.createDeployment({
      projectId: project.id,
      user: {
        id: req.user.id,
        githubUsername: req.user.githubUsername as string,
        githubAccessToken: req.user.githubAccessToken as string,
      },
      commitHash,
    });

    res.status(200).json({
      message: 'Project created successfully',
      deploymentId: deployment?.id,
      url: `${project.subDomain}.${config.BACKEND_URL}`,
    });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
export const streamLogs = async (req: Request, res: Response) => {
  const { deploymentId } = req.params;
  try {
    SentEventService.start(res);
    eventEmitter.on('log', (data) => {
      data = JSON.parse(data);
      if (data) {
        if (data.deploymentId === deploymentId) {
          SentEventService.sendLogToClient(res, data.log);
        }
      }
    });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
export const getLogs = async (req: Request, res: Response) => {
  const { deploymentId } = req.params;
  try {
    const logs = await ProjectService.getLogs(deploymentId);
    res.status(200).json({ logs: logs });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const deployProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    // Temp Solution for Manual Deployment of Github connected projects
    const project = await ProjectService.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    let commitHash;
    if (project.deploymentMethod === 'git') {
      let commits = await GithubService.repoCommits(
        { author: req.user.githubUsername as string, name: project.repo },
        await GithubService.handleAccessToken(
          req.user.githubAccessToken as string,
          req.user.id
        )
      );
      commitHash = commits[0].sha;
    }
    await ProjectService.createDeployment({
      projectId: projectId,
      commitHash,
      user: {
        id: req.user.id,
        githubUsername: req.user.githubUsername as string,
        githubAccessToken: req.user.githubAccessToken as string,
      },
    });

    res.status(200).json({
      message: 'Deployment started successfully',
    });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query as {
    page: string;
    limit: string;
  };
  try {
    const data = await ProjectService.projects({
      userId: req.user.id,
      limit: parseInt(limit),
      page: parseInt(page),
    });
    res.status(200).json(data);
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
export const projectById = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const project = await ProjectService.project(req.user.id, projectId);
    res.status(200).json({ project });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const projectEnvironments = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const enviroments = await ProjectService.getEnviromentVariables(
      projectId,
      req.user.id
    );

    res.status(200).json({ enviroments });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const addEnviromentVariables = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { enviromentVariables } = req.body;
    await ProjectService.addEnviromentVariables({
      userId: req.user.id,
      projectId,
      enviromentVariables,
    });
    res.status(200).json({ message: 'Enviroment variables added' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const updateEnvironmentVariables = async (
  req: Request,
  res: Response
) => {
  try {
    const { environmentId } = req.params;
    const { enviromentVariables } = req.body;
    await ProjectService.updateEnvironmentVariables(
      enviromentVariables,
      environmentId,
      req.user.id
    );
    res.status(200).json({ message: 'Enviroment variables updated' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const deleteEnvironmentVariables = async (
  req: Request,
  res: Response
) => {
  try {
    const { environmentId } = req.params;
    const { variables } = req.body;
    await ProjectService.deleteEnviromentVariables(
      variables,
      environmentId,
      req.user.id
    );
    res.status(200).json({ message: 'Enviroment variables deleted' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const rollbackDeployment = async (req: Request, res: Response) => {
  const { deploymentId } = req.params;
  if (!deploymentId)
    return res.status(400).json({ error: 'Deploymentid not provided' });
  try {
    const deploymentRollback = await ProjectService.rollbackDeployment(
      deploymentId,
      req.user.id
    );
    res.status(200).json({ message: 'Deployment rolled back successfully' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
