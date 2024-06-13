import { config } from '../config/production';
import { JWTTokenDetails, JWTTokenPayload } from '../types/user.type';
import JWT from 'jsonwebtoken';
import { sendMail } from './nodemailer';
import ApiError from './apiError';
import httpStatus from 'http-status';
export function signToken(payload: JWTTokenPayload, expiresIn?: string) {
  return JWT.sign(payload, config.JWT_SECRET, {
    expiresIn: expiresIn || '20d',
  });
}

export function verifyToken(token: string) {
  try {
    return JWT.verify(token, config.JWT_SECRET) as JWTTokenDetails;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');
  }
}

export async function sendVerificationToken(payload: {
  email: string;
  id: string;
}) {
  const verificationToken = signToken(
    {
      ...payload,
      tokenType: 'verification',
    },
    '10m'
  );
  await sendMail(payload.email, verificationToken);
}
