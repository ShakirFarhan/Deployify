import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/apiError';
import ProjectService from '../services/project.service';
import { EnvVariables } from '../types/project.types';
import EcsService from '../services/aws/ecs.service';
import { config } from '../config/production';
export const createProject = async (req: Request, res: Response) => {
  let { name, subDomain, buildCommand, outputDir, repoUrl, envData } = req.body;
  try {
    const project = await ProjectService.create({
      name,
      subDomain,
      buildCommand,
      outputDir,
      repoUrl,
      userId: req.user.id,
    });
    if (!project) res.status(400).json({ error: 'Error creating project' });
    if (envData) {
      console.log('ENVDATA');
      console.log(envData);
      const environments = await ProjectService.addEnviromentVariables({
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
    await EcsService.runTask([
      ...envData,
      { name: 'BUILD_COMMAND', value: project.buildCommand },
      { name: 'OUTPUT_DIR', value: project.outputDir },
      { name: 'SUB_DOMAIN', value: project.subDomain },
      { name: 'REPOSITORY_URL', value: project.repoUrl },
    ]);

    res.status(200).json({
      message: 'Project created successfully',
      url: `${project.subDomain}.${config.BACKEND_URL}`,
    });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
