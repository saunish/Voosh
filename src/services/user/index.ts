import { messageCodeConfig } from '../../configs/message-codes.js';
import { UsersDAO } from '../../data-access-layer/mysql/users.js';
import { UserInterface } from '../../types/index.js';
import { BcryptHelper } from '../../utils/bcrypt-helper.js';
import { createHttpError } from '../../utils/create-http-error.js';
import { logger } from '../../utils/logger.js';

class UserService {
	private usersDAO = new UsersDAO();

	public async createUser(userData: UserInterface): Promise<unknown> {
		const className = UserService.name;
		const functionName = this.createUser.name;
		try {
			const hashedPassword: string = await BcryptHelper.hashPassword(userData.password);
			const user: UserInterface = {
				...userData,
				password: hashedPassword,
			};
			const createdUser = await this.usersDAO.createUser(user);
			if (!createdUser) {
				return Promise.reject(createHttpError(messageCodeConfig.CREATE_ERROR));
			}
			return createdUser;
		} catch (error) {
			logger.error({ functionName, message: 'createUser catch error', error, className });
			throw error;
		}
	}
}

export { UserService };
