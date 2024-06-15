import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { config } from '../../config/production';

export const ecsClient = new ECSClient({
  region: config.AWS.APP_AWS_REGION,
  credentials: {
    accessKeyId: config.AWS.APP_AWS_ACCESS_KEY as string,
    secretAccessKey: config.AWS.APP_AWS_SECRET_ACCESS_KEY as string,
  },
});
class EcsService {
  public static async runTask(environment: { name: string; value: string }[]) {
    const command = new RunTaskCommand({
      cluster: config.ECS.CLUSTER,
      taskDefinition: config.ECS.TASK_DEFINATION,
      count: config.ECS.INSTANCES,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: config.ECS.SUBNETS as unknown as string[],
          securityGroups: config.ECS.SECURITY_GROUPS as unknown as string[],
          assignPublicIp: 'ENABLED',
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: 'boostmydev-builder',
            environment,
          },
        ],
      },
    });

    await ecsClient.send(command);
  }
}

export default EcsService;
