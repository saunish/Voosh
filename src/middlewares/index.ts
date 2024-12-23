import { Application } from 'express';
import { BasicMiddleware } from './basic.js';

class Middleware {
	public static load = async (app: Application): Promise<void> => {
		BasicMiddleware.init(app);
	};
}

export { Middleware };
