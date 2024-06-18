export interface User {
  email: string;
  password: string;
  id: string;
  salt?: string;
  githubAccessToken?: string | null;
  fullName?: string;
  verified?: boolean;
  githubUsername?: string;
  accountStatus?: string;
  role: string;
  provider: 'local' | 'github' | 'google';
}
export interface JWTTokenPayload {
  id: string;
  email: string;
  tokenType?: 'access' | 'verification';
}
export interface JWTTokenDetails {
  id: string;
  email: string;
  tokenType?: 'access' | 'verification';
  iat: number;
  exp: number;
}
export interface GitHubUserPayload {
  id: number;
  login: string;
  avatar_url: string;
  email: string;
  name: string;
}
