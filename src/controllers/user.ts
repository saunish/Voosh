import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/index.js';

class UserController {
	public static signup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UserController.name;
		const functionName = this.signup.name;
		try {
			return res.status(200).json({ message: 'signup successful' });
		} catch (error) {
			logger.error({ functionName, message: 'signup catch error', error, className });
			return next(error);
		}
	};

	public static signin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UserController.name;
		const functionName = this.signin.name;
		try {
			return res.status(200).json({ message: 'signin successful' });
		} catch (error) {
			logger.error({ functionName, message: 'signin catch error', error, className });
			return next(error);
		}
	};
}

export { UserController };
