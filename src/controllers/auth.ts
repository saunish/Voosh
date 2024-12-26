import { Request, Response, NextFunction } from 'express';
import { AppError, hasValue, logger } from '../utils/index.js';
import { AuthService } from '../services/auth/index.js';
import { createHttpResponse } from '../utils/create-http-response.js';
import { RESPONSE_MESSAGE, STATUS_CODE } from '../configs/response-codes.js';

class AuthController {
	private authServices = new AuthService();

	public signup = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AuthController.name;
		const functionName = this.signup.name;
		try {
			const createUser = await this.authServices.createUser(req.body);
			if (!hasValue(createUser)) {
				throw next(createUser);
			}
			return res.status(STATUS_CODE.SUCCESS).json(createHttpResponse({ status: STATUS_CODE.SUCCESS, message: 'User created successfully', data: null }));
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
				throw next(loginUser);
			}
			return res.status(STATUS_CODE.SUCCESS).json(createHttpResponse({ status: STATUS_CODE.SUCCESS, message: 'User logged in successfully', data: { token: loginUser } }));
		} catch (error) {
			logger.error({ functionName, message: 'signin catch error', error, className });
			return next(error);
		}
	};

	public logout = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AuthController.name;
		const functionName = this.logout.name;
		try {
			const loginUserOut = await this.authServices.logout(req.header('authorization')?.replace('Bearer ', '') as string);
			if (!loginUserOut) {
				throw new AppError(RESPONSE_MESSAGE.BAD_REQUEST, STATUS_CODE.BAD_REQUEST);
			}
			return res.status(STATUS_CODE.SUCCESS).json(createHttpResponse({ status: STATUS_CODE.SUCCESS, message: 'User logged out successfully', data: null }));
		} catch (error) {
			logger.error({ functionName, message: 'logout catch error', error, className });
			return next(error);
		}
	};
}

export { AuthController };
