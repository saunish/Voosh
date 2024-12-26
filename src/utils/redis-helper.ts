import { Redis } from '../boot/redis.js';

export const setCache = (key: string, value: unknown, exp: number): Promise<unknown> => Redis.client.set(key, JSON.stringify(value), { EX: exp });

export const getCache = (key: string): Promise<unknown> => Redis.client.get(key);
