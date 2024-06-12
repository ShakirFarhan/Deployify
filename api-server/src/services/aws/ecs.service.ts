import { ECSClient } from '@aws-sdk/client-ecs';
import { config } from '../../config/production';

export const ecsClient = new ECSClient({
  region: config.AWS.APP_AWS_REGION,
  credentials: {
    accessKeyId: config.AWS.APP_AWS_ACCESS_KEY as string,
    secretAccessKey: config.AWS.APP_AWS_SECRET_ACCESS_KEY as string,
  },
});
class EcsService {}

export default EcsService;
