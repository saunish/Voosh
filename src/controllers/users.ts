import { Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { UsersService } from '../services/users/index.js';

class UsersController {
	private usersServices = new UsersService();

	public getAllUsers = async (req: Request, res: Response): Promise<Response> => {
		const className = UsersController.name;
		const functionName = this.getAllUsers.name;
		try {
			const users = await this.usersServices.getAllUsers(req.user as { userId: string });
			return res.status(200).json({ status: 200, data: users, message: 'users fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAllUsers catch error', error, className });
			return res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: null });
		}
	};

	public addUser = async (req: Request, res: Response): Promise<Response> => {
		const className = UsersController.name;
		const functionName = this.addUser.name;
		try {
			const user = await this.usersServices.addUser(req.body);
			return res.status(200).json({ status: 200, data: user, message: 'user added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addUser catch error', error, className });
			return res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: null });
		}
	};

	public deleteUser = async (req: Request, res: Response): Promise<Response> => {
		const className = UsersController.name;
		const functionName = this.deleteUser.name;
		try {
			const user = await this.usersServices.deleteUser(req.params.userId);
			return res.status(200).json({ status: 200, data: user, message: 'user added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addUser catch error', error, className });
			return res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: null });
		}
	};
}

export { UsersController };
