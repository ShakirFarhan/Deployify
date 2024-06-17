import httpStatus from 'http-status';
import { EnvVariables, Project } from '../types/project.types';
import ApiError from '../utils/apiError';
import UserService from './user.service';
import { prismaClient } from '../client';
import { validateBuildCommand, validateEnvs } from '../utils/validation';
import EcsService from './aws/ecs.service';
import slugify from 'slugify';
class ProjectService {
  private static async validateProjectAndUser(
    projectId: string,
    userId: string
  ) {
    const project = await prismaClient.project.findUnique({
      where: {
        id: projectId,
        userId,
      },
    });
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    return project;
  }
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
        subDomain: slugify(subDomain, { lower: true }),
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
    validateEnvs(enviromentVariables);
    if (!userId || !projectId)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing Fields');
    const project = await this.validateProjectAndUser(projectId, userId);
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
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
    const project = await this.validateProjectAndUser(projectId, userId);
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    // TODO: Users can look for env's with name & projectId
    return await prismaClient.environment.findFirst({
      where: {
        projectId,
      },
      select: {
        id: true,
        environmentVariables: {
          select: {
            id: true,
            key: true,
            value: true,
          },
        },
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
        // TODO: Can add validation to check whether the environment exist before updating
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

  public static async createDeployment(data: {
    projectId: string;
    userId: string;
  }) {
    const { projectId, userId } = data;
    if (!projectId || !userId)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing fields');
    const project = await this.validateProjectAndUser(projectId, userId);
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');

    const deployment = await prismaClient.deployment.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
    // Checking if any environments exist for the project, if yes then deploy with those environments
    const environments = await this.getEnviromentVariables(projectId, userId);
    if (!environments || environments.environmentVariables.length === 0) return;
    let envData = environments.environmentVariables.map((env: EnvVariables) => {
      return {
        name: env.key,
        value: env.value,
      };
    });
    await EcsService.runTask([
      ...envData,
      { name: 'BUILD_COMMAND', value: project.buildCommand },
      { name: 'OUTPUT_DIR', value: project.outputDir },
      { name: 'SUB_DOMAIN', value: project.subDomain },
      { name: 'REPOSITORY_URL', value: project.repoUrl },
      { name: 'PROJECT_ID', value: project.id },
      { name: 'DEPLOYMENT_ID', value: deployment.id },
    ]);
  }
}

export default ProjectService;
