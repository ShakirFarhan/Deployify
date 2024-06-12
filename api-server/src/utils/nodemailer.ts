import nodemailer from 'nodemailer';
import { config } from '../config/production';
import ApiError from './apiError';
import httpStatus from 'http-status';
export const sendMail = async (email: string, token: string) => {
  try {
    const transport = nodemailer.createTransport({
      port: config.NODEMAILER.port,
      host: config.NODEMAILER.host,
      service: config.NODEMAILER.service,
      secure: config.NODEMAILER.secure,
      auth: {
        user: config.NODEMAILER.auth.user,
        pass: config.NODEMAILER.auth.pass,
      },
    });
    await transport.sendMail({
      from: config.NODEMAILER.auth.user,
      to: email,
      subject: 'Confirm Your Email Address',
      text: `
      <p>Thank you for registering! Please click the following link to confirm your email:</p>
      <a href="${process.env.CLIENT_URL}/confirm-email?code=${token}">Confirm Email</a>
    `,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send the verification email'
    );
  }
};
