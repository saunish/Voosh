import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@casl/ability';
import { AppAbility, Actions, Subjects } from '../configs/index.js';

declare module 'express' {
	interface Request {
		ability?: AppAbility;
	}
}

export const checkAbility = (action: Actions, subject: Subjects) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			ForbiddenError.from(req.ability!).throwUnlessCan(action, subject);
			next();
		} catch (error: unknown) {
			res.status(403).json({
				status: 403,
				message: 'Forbidden: Access Denied',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	};
};
