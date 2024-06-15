import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import { createProject } from '../controllers/project.controller';
const router = express.Router();

router.post('/create', isUserAuthenticated, createProject);
export default router;
