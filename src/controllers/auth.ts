import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/index.js';
import { AuthService } from '../services/auth/index.js';

class AuthController {
	private authServices = new AuthService();

	public signup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AuthController.name;
		const functionName = this.signup.name;
		try {
			const createUser = await this.authServices.createUser(req.body);
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
		const className = AuthController.name;
		const functionName = this.signin.name;
		try {
			const loginUser = await this.authServices.login(req.body);
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
		const className = AuthController.name;
		const functionName = this.logout.name;
		try {
			console.log(req.header('authorization')?.replace('Bearer ', ''));
			const loginUserOut = await this.authServices.logout(req.header('authorization')?.replace('Bearer ', '') as string);
			if (!loginUserOut) {
				return res.status(400).json({ status: 400, data: null, message: 'logout failed', error: null });
			}
			return res.status(200).json(loginUserOut);
		} catch (error) {
			logger.error({ functionName, message: 'logout catch error', error, className });
			return next(error);
		}
	};
}

export { AuthController };
