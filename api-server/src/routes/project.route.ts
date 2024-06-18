import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import {
  createProject,
  deployProject,
  getLogs,
} from '../controllers/project.controller';
const router = express.Router();
router.post('/create', isUserAuthenticated, createProject);
router.post('/:projectId/deploy', isUserAuthenticated, deployProject);
router.get('/:deploymentId/logs', isUserAuthenticated, getLogs);

router.get('/');
export default router;
