import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';

export interface UserPayload {
  id: string;
  email: string;
  fullName: string;
  password: string;
  githubUsername: string;

  role: 'admin' | 'user' | 'moderator';
  provider: string;
  // profilePhoto: string;
}
export interface AuthState {
  userInfo: Pick<UserPayload, 'email' | 'id' | 'role'> | null;
  userToken: string | null;
  loading: boolean;
  error: any | null;
  success?: boolean;
}

export interface RootState {
  auth: AuthState;
}
export type RtkBuilder = EndpointBuilder<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  'User',
  'api'
>;
export interface RootState {
  auth: AuthState;
}

export interface Notification {
  id: string;
  sender: UserPayload;
  // recipient: UserPayload;
  type?: string;
  content: string;
  status: string;
  createdAt: string;
  redirectUri: string;
  count?: number;
}
export interface GroupedNotification {
  count: number;
  key: string;
  notification: Notification;
}
