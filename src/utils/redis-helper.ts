import { Redis } from '../boot/redis.js';

export const setCache = (key: string, value: unknown): Promise<unknown> => Redis.client.set(key, JSON.stringify(value));

export const getCache = (key: string): Promise<unknown> => Redis.client.get(key);
