import express from 'express';
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import slugify from 'unique-slug';
import dotenv from 'dotenv';
import { config } from './config/production';
import { Server } from 'socket.io';
import Redis from 'ioredis';
dotenv.config();
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ecsClient = new ECSClient({
  region: config.AWS.APP_AWS_REGION,
  credentials: {
    accessKeyId: config.AWS.APP_AWS_ACCESS_KEY as string,
    secretAccessKey: config.AWS.APP_AWS_SECRET_ACCESS_KEY as string,
  },
});
const sub = new Redis(config.REDIS.URL as string);
const io = new Server({
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  socket.on('subscribe', (channel) => {
    console.log(channel);
    socket.join(channel);
    socket.emit('message', `Joined ${channel}`);
  });
});

app.get('/project', async (req, res) => {
  const { repoUrl } = req.body;
  if (!repoUrl)
    return res.status(400).json({ message: 'Repo url is required' });
  const slug = slugify();

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
          environment: [
            { name: 'APP_AWS_ACCESS_KEY', value: config.S3.APP_AWS_ACCESS_KEY },
            {
              name: 'APP_AWS_SECRET_ACCESS_KEY',
              value: config.S3.APP_AWS_SECRET_ACCESS_KEY,
            },
            {
              name: 'APP_AWS_REGION',
              value: config.S3.APP_AWS_REGION,
            },
            {
              name: 'APP_AWS_BUCKET',
              value: config.S3.APP_AWS_BUCKET,
            },
            {
              name: 'REPOSITORY_URL',
              value: repoUrl,
            },
            {
              name: 'APP_PROJECT_SLUG',
              value: slug,
            },
            {
              name: 'APP_REDIS_URL',
              value: config.REDIS.URL,
            },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);
  res.status(200).json({ slug, url: `http://${slug}.localhost:8000` });
});

function initRedisSub() {
  sub.psubscribe('LOGS:*');

  sub.on('pmessage', (pattern, channel, message) => {
    console.log(pattern, channel, message);
    io.to(channel).emit('message', JSON.parse(message));
  });
}
initRedisSub();
io.listen(8765);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
