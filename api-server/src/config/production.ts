import dotenv from 'dotenv';
dotenv.config();
export const config = {
  AWS: {
    APP_AWS_REGION: process.env.APP_AWS_REGION,
    APP_AWS_ACCESS_KEY: process.env.APP_AWS_ACCESS_KEY,
    APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
  ECS: {
    CLUSTER: process.env.AWS_ECS_CLUSTER,
    TASK_DEFINATION: process.env.AWS_ECS_TASK_DEFINATION,
    INSTANCES: 1,
    SUBNETS: JSON.parse(process.env.AWS_ECS_SUBNETS as string),
    SECURITY_GROUPS: JSON.parse(process.env.AWS_ECS_SECURITY_GROUPS as string),
  },
  S3: {
    APP_AWS_ACCESS_KEY: process.env.APP_AWS_ACCESS_KEY,
    APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY,
    APP_AWS_REGION: process.env.APP_AWS_REGION,
    APP_AWS_BUCKET: process.env.APP_AWS_BUCKET,
  },
  REDIS: {
    URL: process.env.APP_REDIS_URL,
  },
};
