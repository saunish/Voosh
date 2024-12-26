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

	public signin = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UserController.name;
		const functionName = this.signin.name;
		try {
			const loginUser = await this.userServices.login(req.body);
			if (!loginUser) {
				return res.status(400).json({ status: 400, data: null, message: 'login failed', error: null });
			}
			return res.status(200).json(loginUser);
		} catch (error) {
			logger.error({ functionName, message: 'login catch error', error, className });
			return next(error);
		}
	};

	public logout = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UserController.name;
		const functionName = this.logout.name;
		try {
			console.log(req.header('authorization')?.replace('Bearer ', ''));
			const loginUserOut = await this.userServices.logout(req.header('authorization')?.replace('Bearer ', '') as string);
			if (!loginUserOut) {
				return res.status(400).json({ status: 400, data: null, message: 'logout failed', error: null });
			}
			return res.status(200).json(loginUserOut);
		} catch (error) {
			logger.error({ functionName, message: 'logout catch error', error, className });
			return next(error);
		}
	};

	public secure = async (_req: Request, res: Response): Promise<Response> => {
		return res.status(200).json({ status: 200, data: null, message: 'secure route', error: null });
	};
}

export { UserController };
