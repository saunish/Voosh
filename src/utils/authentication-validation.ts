import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createHttpResponse, logger } from './index.js';
import { UserInterface } from '../data-access-layer/mysql/users.js';
import passport from 'passport';

class AuthValidator {
	public validate = (): RequestHandler => {
		const className = AuthValidator.name;
		const functionName = this.validate.name;

		return (req: Request, res: Response, next: NextFunction): void => {
			passport.authenticate('JwtStrategy', { session: false }, (err: Error, user: UserInterface, info: { message?: string }) => {
				if (err) {
					return res.status(500).json(createHttpResponse({ status: 500, message: 'Internal Server Error' }));
				}
				if (!user) {
					logger.error({ functionName, message: 'Unauthorized Access', className, error: info ?? err });
					return res.status(401).json(createHttpResponse({ status: 401, message: info?.message ?? 'Unauthorized Access' }));
				}
				req.user = user;
				next();
			})(req, res, next);
		};
	};
}

const authValidatorInstance = new AuthValidator();
export { authValidatorInstance };
