import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/index.js';
import { UserService } from '../services/user/index.js';

class UserController {
	private userServices = new UserService();

	public signup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UserController.name;
		const functionName = this.signup.name;
		try {
			const createUser = await this.userServices.createUser(req.body);
			if (!createUser) {
				return res.status(400).json({ status: 400, data: null, message: 'signup failed', error: null });
			}
			return res.status(200).json({ status: 201, data: null, message: 'signup successful', error: null });
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
