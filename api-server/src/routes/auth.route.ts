import express from 'express';
import {
  login,
  register,
  resendToken,
  verifyToken,
} from '../controllers/auth.controller';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.patch('/verify', verifyToken);
router.get('/resend', resendToken);
// router.patch("/change-password",isUserAuthenticated,changePassword);

export default router;
