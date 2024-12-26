import { Application, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { morganLogger } from '../utils/index.js';
import passport from 'passport';

class BasicMiddleware {
	public static init = (app: Application): void => {
		const corsWhitelistedUrls = process.env.CORS_WHITELISTED_URLS ? process.env.CORS_WHITELISTED_URLS.split(',') : ['*'];
		app.use(helmet());
		app.use(
			cors({
				origin: corsWhitelistedUrls,
				credentials: true,
			}),
		);
		app.use(json());
		app.use(urlencoded({ extended: false }));
		app.use(morganLogger);
		app.use(passport.initialize());
	};
}

export { BasicMiddleware };
