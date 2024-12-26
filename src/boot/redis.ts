import { createClient, RedisClientType } from 'redis';
import { REDIS_CONFIG } from '../configs/index.js';

class Redis {
	public static client: RedisClientType;

	public static init = async (): Promise<void> => {
		Redis.client = createClient(process.env.REDIS_URL ? { url: process.env.REDIS_URL } : REDIS_CONFIG);
		await Redis.client.connect();
		await Redis.client.select(REDIS_CONFIG.db);
	};
}

export { Redis };
