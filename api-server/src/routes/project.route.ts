import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import {
  addEnviromentVariables,
  createProject,
  deleteEnvironmentVariables,
  deployProject,
  getLogs,
  getProjects,
  projectById,
  projectEnvironments,
  streamLogs,
  updateEnvironmentVariables,
} from '../controllers/project.controller';
const router = express.Router();
router.get('/all', isUserAuthenticated, getProjects);
router.post('/create', isUserAuthenticated, createProject);
router.get('/:projectId', isUserAuthenticated, projectById);
router.post('/:projectId/deploy', isUserAuthenticated, deployProject);
router.get(
  '/:projectId/environments',
  isUserAuthenticated,
  projectEnvironments
);
router.post(
  '/:projectId/environments',
  isUserAuthenticated,
  addEnviromentVariables
);
router.patch(
  '/environments/:environmentId',
  isUserAuthenticated,
  updateEnvironmentVariables
);
router.delete(
  '/environments/:environmentId',
  isUserAuthenticated,
  deleteEnvironmentVariables
);
router.get('/:deploymentId/logs', isUserAuthenticated, getLogs);
router.get('/:deploymentId/stream-logs', isUserAuthenticated, streamLogs);

export default router;
