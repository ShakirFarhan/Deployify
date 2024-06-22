import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import {
  configuredRepositories,
  connectToGithub,
  fetchRepositories,
} from '../controllers/github.controller';
import GithubService from '../services/github.service';
const router = express.Router();
router.get('/user/repositories', isUserAuthenticated, configuredRepositories);
router.post('/connect', isUserAuthenticated, connectToGithub);
router.get('/generate', (req, res) => {
  const token = GithubService.generateJwt();
  res.send(token);
});
export default router;
