import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { prismaClient } from '../client';
export const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Invalid authorization' });
  const token = header.split(' ')[1];
  try {
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    const user = await prismaClient.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
        provider: true,
        role: true,
      },
    });
    if (!user) return res.status(401).json({ error: 'Invalid User' });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Invalid User' });
  }
};