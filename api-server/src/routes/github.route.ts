import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import {
  fetchRepositories,
  setupWebhook,
} from '../controllers/github.controller';
import GithubService from '../services/github.service';
const router = express.Router();
router.get('/user/repositories', isUserAuthenticated, fetchRepositories);
router.post('/repo/webhook', isUserAuthenticated, setupWebhook);
router.get('/generate', (req, res) => {
  const token = GithubService.generateJwt();
  res.send(token);
});
export default router;
