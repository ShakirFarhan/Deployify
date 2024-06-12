import { createHmac } from 'crypto';
export function encryptPassword(password: string, salt: string) {
  return createHmac('sha256', salt).update(password).digest('hex');
}
