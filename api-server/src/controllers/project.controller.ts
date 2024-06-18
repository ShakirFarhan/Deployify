import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/apiError';
import ProjectService from '../services/project.service';
import { EnvVariables } from '../types/project.types';
import EcsService from '../services/aws/ecs.service';
import { config } from '../config/production';
export const createProject = async (req: Request, res: Response) => {
  let { name, subDomain, buildCommand, outputDir, repoUrl, envData } = req.body;
  try {
    // Creating a new project
    const project = await ProjectService.create({
      name,
      subDomain,
      buildCommand,
      outputDir,
      repoUrl,
      userId: req.user.id,
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
    // Creating a deployment for the project
    await ProjectService.createDeployment({
      projectId: project.id,
      userId: req.user.id,
    });

    res.status(200).json({
      message: 'Project created successfully',
      url: `${project.subDomain}.${config.BACKEND_URL}`,
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
    await ProjectService.createDeployment({
      projectId: projectId,
      userId: req.user.id,
    });

    res.status(200).json({
      message: 'Deployment started successfully',
    });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
