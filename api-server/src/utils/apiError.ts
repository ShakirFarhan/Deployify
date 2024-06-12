import { Response } from 'express';
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string | undefined,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export function ErrorHandler(error: Error, res: Response) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message });
  } else {
    return new ApiError(500, error.message, false);
  }
}
export default ApiError;
