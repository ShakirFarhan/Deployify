import Redis from 'ioredis';
import { config } from '../config/production';

export const sub = new Redis(config.REDIS.URL as string);
