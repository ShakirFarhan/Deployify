export interface User {
  email: string;
  password: string;
  id: string;
  salt?: string;
  githubId?: string;
  fullName?: string;
  verified: boolean;
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
