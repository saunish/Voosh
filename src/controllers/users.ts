import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { UsersService } from '../services/users/index.js';
import { STATUS_CODE } from '../configs/response-codes.js';

class UsersController {
	private usersServices = new UsersService();

	public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UsersController.name;
		const functionName = this.getAllUsers.name;
		try {
			const payload = {
				limit: Number(req.query.limit) || 5,
				offset: Number(req.query.offset) || 5,
				userId: req.user?.userId as string,
			};
			const users = await this.usersServices.getAllUsers(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: users, message: 'users fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAllUsers catch error', error, className });
			return next(error);
		}
	};

	public addUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UsersController.name;
		const functionName = this.addUser.name;
		try {
			const user = await this.usersServices.addUser(req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: user, message: 'user added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addUser catch error', error, className });
			return next(error);
		}
	};

	public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UsersController.name;
		const functionName = this.deleteUser.name;
		try {
			const user = await this.usersServices.deleteUser(req.params.userId);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: user, message: 'user deleted successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'deleteUser catch error', error, className });
			return next(error);
		}
	};

	public updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = UsersController.name;
		const functionName = this.updatePassword.name;
		try {
			const payload = {
				...req.body,
				...req.user,
				token: req.header('authorization')?.replace('Bearer ', '') as string,
			};
			const user = await this.usersServices.updatePassword(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: user, message: 'user password updated successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'user password update catch error', error, className });
			return next(error);
		}
	};
}

export { UsersController };
