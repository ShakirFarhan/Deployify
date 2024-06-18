import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import {
  fetchRepositories,
  setupWebhook,
} from '../controllers/github.controller';
const router = express.Router();
router.get('/user/repositories', isUserAuthenticated, fetchRepositories);
router.post('/repo/webhook', isUserAuthenticated, setupWebhook);
export default router;
