import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import projectRoutes from './routes/project.route';
import { logsConsumer } from './services/kafka.service';

dotenv.config();
const app = express();
const PORT = 8080;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-user/v1/auth', authRoutes);
app.use('/api-user/v1/project', projectRoutes);
logsConsumer();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
