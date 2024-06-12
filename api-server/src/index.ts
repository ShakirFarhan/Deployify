import express from 'express';
import { RunTaskCommand } from '@aws-sdk/client-ecs';
import slugify from 'unique-slug';
import dotenv from 'dotenv';
import { config } from './config/production';
import SocketService from './services/socket.service';
import { ecsClient } from './services/aws/ecs.service';
import authRoutes from './routes/auth.route';
const socketService = new SocketService();
dotenv.config();
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-user/v1/auth', authRoutes);
app.post('/project', async (req, res) => {
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
            {
              name: 'REPOSITORY_URL',
              value: repoUrl,
            },
            {
              name: 'APP_PROJECT_SLUG',
              value: slug,
            },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);
  res.status(200).json({ slug, url: `http://${slug}.localhost:8000` });
});
socketService.initListeners();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
