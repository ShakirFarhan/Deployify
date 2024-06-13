import express from 'express';
import {
  changePassword,
  githubAuth,
  login,
  register,
  resendToken,
  verifyToken,
} from '../controllers/auth.controller';
import { isUserAuthenticated } from '../middlewares/auth';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.patch('/verify', verifyToken);
router.get('/resend', resendToken);
router.post('/github', githubAuth);
router.patch('/change-password', isUserAuthenticated, changePassword);

export default router;
