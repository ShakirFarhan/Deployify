import express from 'express';
import { User } from './user.type';
declare global {
  namespace Express {
    interface Request {
      user: Pick<
        User,
        | 'id'
        | 'provider'
        | 'githubAccessToken'
        | 'role'
        | 'githubUsername'
        | 'githubAppToken'
        | 'installationId'
      >;
    }
  }
}
