import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { ErrorHandler } from '../utils/apiError';
import UserService from '../services/user.service';
import { sendVerificationToken } from '../utils/token';
import { encryptPassword } from '../utils/encryption';
import { randomBytes } from 'crypto';
export const register = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const message = await AuthService.register(body);
    res.status(200).json({ message });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response = await AuthService.login(req.body);
    res.status(200).json(response);
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };
  if (!token) return res.status(400).json({ error: 'Provide token' });
  try {
    const response = await AuthService.verifyEmail(token);
    res.status(200).json(response);
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const resendToken = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Provide email' });
  try {
    const emailExist = await UserService.findByEmail(email);
    if (!emailExist) return res.status(404).json({ error: 'Email not found' });
    if (emailExist.verified)
      return res.status(200).json({ error: 'Email already verified' });
    await sendVerificationToken(email);
    res.status(200).json({ message: 'Verification token sent successfully' });
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await UserService.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.provider === 'local' || user.salt) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          error: 'Please provide both old password and new password.',
        });
      }
      const oldHash = encryptPassword(oldPassword, user.salt as string);
      if (oldHash !== user.password) {
        return res.status(401).json({ message: 'Invalid Old Password' });
      }
      const newHash = encryptPassword(newPassword, user.salt as string);
      await UserService.update(user.id, { password: newHash });
      res.status(200).json({ message: 'Password changed' });
    } else {
      if (!user.salt) {
        if (!newPassword)
          return res.status(401).json({ error: 'probide new password' });
        const salt = randomBytes(32).toString('hex');
        const newHash = encryptPassword(newPassword, salt);
        await UserService.update(user.id, {
          salt,
          password: newHash,
        });
        res.status(200).json({ message: 'Password changed' });
      }
    }
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};

export const githubAuth = async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'provide code' });
  try {
    const response = await AuthService.githubOAuth(code);
    res.status(200).json(response);
  } catch (error: any) {
    ErrorHandler(error, res);
  }
};
