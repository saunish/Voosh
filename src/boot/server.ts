import express from 'express';
import { logger } from '../utils/index.js';
import { Middleware } from '../middlewares/index.js';
import { KnexClient } from './knex.js';
import { Redis } from './redis.js';
import { Route } from '../routes/index.js';

class Server {
	public static app: express.Application;

	public static init = async (): Promise<express.Application> => {
		const className = Server.name;
		const functionName = this.init.name;
		try {
			logger.info({ functionName, message: 'Initializing server', className });
			Server.app = express();

			await Middleware.load(Server.app);
			logger.info({ functionName, message: 'middleware loaded successfully', className });

			await KnexClient.init();
			logger.info({ functionName, message: 'knex loaded successfully', className });

			await Redis.init();
			logger.info({ functionName, message: 'Redis loaded successfully', className });

			await Route.load(Server.app);
			logger.info({ functionName, message: 'routes loaded successfully', className });

			return Server.app;
		} catch (error: unknown) {
			logger.error({ functionName, message: 'Error while initializing server', className, error });
			throw error;
		}
	};
}

export { Server };
