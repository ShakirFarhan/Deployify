import httpStatus from 'http-status';
import { EnvVariables, Project } from '../types/project.types';
import ApiError from '../utils/apiError';
import UserService from './user.service';
import { prismaClient } from '../client';
import { validateBuildCommand, validateEnvs } from '../utils/validation';

class ProjectService {
  public static async create(
    data: Pick<
      Project,
      'name' | 'subDomain' | 'userId' | 'buildCommand' | 'outputDir' | 'repoUrl'
    >
  ) {
    const { name, subDomain, userId, buildCommand, repoUrl, outputDir } = data;
    if (!name || !subDomain || !userId || !repoUrl) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');
    }
    const userExist = await UserService.findById(userId);
    if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    const subDomainExist = await this.findBySubDomain(subDomain);
    if (subDomainExist)
      throw new ApiError(httpStatus.CONFLICT, 'sub domain already exist');
    validateBuildCommand(buildCommand);

    const project = await prismaClient.project.create({
      data: {
        name,
        subDomain,
        userId,
        buildCommand,
        outputDir,
        repoUrl,
      },
    });
    return project;
  }

  public static async findById(id: string) {
    return await prismaClient.project.findUnique({
      where: {
        id,
      },
    });
  }
  public static async findBySubDomain(domain: string) {
    if (!domain || typeof domain !== 'string')
      throw new ApiError(httpStatus.BAD_REQUEST, 'provide valid sub domain');
    return await prismaClient.project.findUnique({
      where: {
        subDomain: domain,
      },
    });
  }
  public static async update(data: {
    project: Pick<
      Project,
      'buildCommand' | 'name' | 'subDomain' | 'outputDir' | 'id'
    >;
    userId: string;
  }) {
    const { buildCommand, name, subDomain, outputDir, id } = data.project;
    if (!data.userId)
      throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');
    return await prismaClient.project.update({
      where: {
        id: id,
        userId: data.userId,
      },
      data: {
        buildCommand: buildCommand,
        name: name,
        subDomain: subDomain,
        outputDir: outputDir,
      },
    });
  }

  public static async delete(id: string, userId: string) {
    return await prismaClient.project.delete({
      where: {
        id,
        userId,
      },
    });
  }

  public static async addEnviromentVariables(data: {
    userId: string;
    projectId: string;
    name?: string;
    enviromentVariables: EnvVariables[];
  }) {
    const { userId, projectId, name, enviromentVariables } = data;
    console.log(name);
    console.log(enviromentVariables);
    validateEnvs(enviromentVariables);
    if (!userId || !projectId)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');
    const project = await this.findById(projectId);
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    if (project.userId !== userId)
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
    return await prismaClient.project.update({
      where: {
        id: projectId,
        userId,
      },
      data: {
        environments: {
          create: {
            name,
            environmentVariables: {
              createMany: {
                data: enviromentVariables,
              },
            },
          },
        },
      },
    });
  }

  public static async getEnviromentVariables(
    projectId: string,
    userId: string
  ) {
    const project = await this.findById(projectId);
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
    if (project.userId !== userId)
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
    await prismaClient.environment.findMany({
      where: {
        projectId,
      },
      include: {
        environmentVariables: true,
      },
    });
  }

  public static async deleteEnviromentVariables(
    variableIds: string[],
    environmentId: string,
    userId: string
  ) {
    if (
      !Array.isArray(variableIds) ||
      !variableIds.every((v) => typeof v === 'string')
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'variables must be an array of strings'
      );
    }
    const env = await prismaClient.environment.findUnique({
      where: {
        id: environmentId,
      },
      include: {
        project: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!env) throw new ApiError(httpStatus.NOT_FOUND, 'Environment not found');
    if (env.project.userId !== userId)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');

    return await prismaClient.environmentVariable.deleteMany({
      where: {
        id: {
          in: variableIds,
        },
      },
    });
  }

  public static async updateEnvironmentVariables(
    variables: EnvVariables[],
    environmentId: string,
    userId: string
  ) {
    validateEnvs(variables, true);
    const env = await prismaClient.environment.findUnique({
      where: {
        id: environmentId,
      },
      include: {
        project: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!env) throw new ApiError(httpStatus.NOT_FOUND, 'Environment not found');
    if (env.project.userId !== userId)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'UNAUTHORIZED');

    const updateVariables = await Promise.all(
      variables.map(async (variable) => {
        // Can add validation to check whether the environment exist before updating
        return await prismaClient.environmentVariable.update({
          where: {
            id: variable.id,
          },
          data: {
            key: variable.key,
            value: variable.value,
          },
        });
      })
    );
    return updateVariables;
  }
}

export default ProjectService;
