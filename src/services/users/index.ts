import { UserInterface, UsersDAO } from '../../data-access-layer/mysql/users.js';
import { BcryptHelper } from '../../utils/bcrypt-helper.js';
import { createHttpResponse, hasValue, safePromise } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class UsersService {
	private usersDAO = new UsersDAO();

	public async getAllUsers(body: { userId: string }): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.getAllUsers.name;
		try {
			const [error, users] = await safePromise(this.usersDAO.getAllUsersByParentId(body.userId));
			if (hasValue(error)) {
				return Promise.reject(createHttpResponse({ status: 500, message: 'Internal Server Error' }));
			} else if (hasValue(users)) {
				return createHttpResponse({ status: 200, message: 'All users', data: users });
			} else {
				return createHttpResponse({ status: 404, message: 'No users found' });
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAllUsers catch error', error, className });
			throw error;
		}
	}

	public async addUser(body: UserInterface): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.addUser.name;
		try {
			const [errorVerifyUser, verifyUser] = await safePromise(this.usersDAO.getUserByEmail(body.email));
			if (hasValue(errorVerifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `Bad Request` }));
			} else if (hasValue(verifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `Email already exists.` }));
			}
			const hashedPassword: string = await BcryptHelper.hashPassword(body.password);
			const newUser = {
				...body,
				password: hashedPassword,
				role: body.role,
			};

			const [error, user] = await safePromise(this.usersDAO.createUser(newUser));
			if (hasValue(error)) {
				return Promise.reject(createHttpResponse({ status: 500, message: 'Internal Server Error' }));
			} else if (hasValue(user)) {
				return createHttpResponse({ status: 200, message: 'User added', data: user });
			} else {
				return createHttpResponse({ status: 409, message: 'User not added' });
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addUser catch error', error, className });
			throw error;
		}
	}

	public async deleteUser(userId: string): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.deleteUser.name;
		try {
			const [errorVerifyUser, verifyUser] = await safePromise(this.usersDAO.getUserById(userId));
			if (hasValue(errorVerifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `Bad Request` }));
			} else if (!hasValue(verifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `no such id exist` }));
			} else {
				if (verifyUser.role === 'admin') {
					return Promise.reject(createHttpResponse({ status: 409, message: `You can't delete an admin` }));
				}

				const [error, user] = await safePromise(this.usersDAO.deleteUser(userId));
				if (hasValue(error)) {
					return Promise.reject(createHttpResponse({ status: 500, message: 'Internal Server Error' }));
				} else if (hasValue(user)) {
					return createHttpResponse({ status: 200, message: 'User deleted', data: user });
				} else {
					return createHttpResponse({ status: 404, message: 'User not found' });
				}
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'deleteUser catch error', error, className });
			throw error;
		}
	}
}

export { UsersService };
