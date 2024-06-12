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
  REDIS: {
    URL: process.env.APP_REDIS_URL,
  },
  JWT_SECRET: process.env.JWT_SECRET as string,
  NODEMAILER: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Boolean(process.env.SMTP_SECURE),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};
