import { UsersDAO, UserInterface } from '../../data-access-layer/mysql/users.js';
import { BcryptHelper } from '../../utils/bcrypt-helper.js';
import { createHttpResponse, hasValue, safePromise } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class UserService {
	private usersDAO = new UsersDAO();

	public async createUser(userData: UserInterface): Promise<unknown> {
		const className = UserService.name;
		const functionName = this.createUser.name;
		try {
			const [errorVerifyUser, verifyUser] = await safePromise(this.usersDAO.getUserByEmail(userData.email));
			if (hasValue(errorVerifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `Bad Request` }));
			} else if (hasValue(verifyUser)) {
				return Promise.reject(createHttpResponse({ status: 409, message: `Email already exists.` }));
			}
			const hashedPassword: string = await BcryptHelper.hashPassword(userData.password);
			const user = {
				...userData,
				password: hashedPassword,
				role: 'admin',
			};
			const createdUser = await safePromise(this.usersDAO.createUser(user));
			if (hasValue(createdUser)) {
				return createHttpResponse({ status: 201, message: 'User created successfully' });
			} else {
				return createHttpResponse({ status: 500, message: 'Internal Server Error' });
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'createUser catch error', error, className });
			throw error;
		}
	}
}

export { UserService };