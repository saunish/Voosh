import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createHttpResponse, logger } from './index.js';
import { UserInterface } from '../data-access-layer/mysql/users.js';
import passport from 'passport';
import { defineAbilityFor } from '../configs/casl-config.js';
import { RESPONSE_MESSAGE, STATUS_CODE } from '../configs/response-codes.js';

export interface User {
	userId: string;
	email: string;
	role: string;
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}

class AuthValidator {
	public validate = (): RequestHandler => {
		const className = AuthValidator.name;
		const functionName = this.validate.name;

		return (req: Request, res: Response, next: NextFunction): void => {
			passport.authenticate('JwtStrategy', { session: false }, (err: Error, user: UserInterface & { ability: unknown }, info: { message?: string }) => {
				if (err) {
					return next(err);
				}
				if (!user) {
					logger.error({ functionName, message: 'Unauthorized Access', className, error: info ?? err });
					return res.status(STATUS_CODE.UNAUTHORIZED).json(createHttpResponse({ status: STATUS_CODE.UNAUTHORIZED, message: info?.message ?? RESPONSE_MESSAGE.UNAUTHORIZED }));
				}
				req.ability = defineAbilityFor(user.role as string);
				req.user = {
					userId: user.userId,
					email: user.email,
					role: user.role,
				};
				next();
			})(req, res, next);
		};
	};
}

const authValidatorInstance = new AuthValidator();
export { authValidatorInstance };
