import { createClient, RedisClientType } from 'redis';
import { REDIS_CONFIG } from '../configs/index.js';

class Redis {
	public static client: RedisClientType;

	public static init = async (): Promise<void> => {
		Redis.client = createClient(REDIS_CONFIG);
		await Redis.client.connect();
		await Redis.client.select(REDIS_CONFIG.db);
	};
}

export { Redis };
