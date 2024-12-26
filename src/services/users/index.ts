import { UserInterface, UsersDAO } from '../../data-access-layer/mysql/users.js';
import { BcryptHelper } from '../../utils/bcrypt-helper.js';
import { AppError, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class UsersService {
	private usersDAO = new UsersDAO();

	public async getAllUsers(body: { parentId: string; limit: number; offset: number }): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.getAllUsers.name;
		try {
			const users = await this.usersDAO.getAllUsersByParentId(body.parentId, null, null, Number(body.limit), Number(body.offset));
			if (hasValue(users)) {
				return users;
			} else {
				throw new AppError('No users found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAllUsers catch error', error, className });
			throw error;
		}
	}

	public async addUser(body: UserInterface & { parent: { userId: string } }): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.addUser.name;
		try {
			const verifyUser = await this.usersDAO.getUserByEmail(body.email);
			if (hasValue(verifyUser)) {
				throw new AppError('Email already exists.', 409);
			}
			const hashedPassword: string = await BcryptHelper.hashPassword(body.password);
			const newUser = {
				...body,
				password: hashedPassword,
				role: body.role,
				parentId: body.parent.userId,
			};

			return await this.usersDAO.createUser(newUser);
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addUser catch error', error, className });
			throw error;
		}
	}

	public async deleteUser(userId: string): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.deleteUser.name;
		try {
			const verifyUser = await this.usersDAO.getUserById(userId);
			if (!hasValue(verifyUser)) {
				throw new AppError('no such id exist', 409);
			} else {
				if (verifyUser.role === 'admin') {
					throw new AppError(`You can't delete an admin`, 409);
				}
				const user = await this.usersDAO.deleteUser(userId);
				if (hasValue(user)) {
					return user;
				} else {
					throw new AppError('User not found', 404);
				}
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'deleteUser catch error', error, className });
			throw error;
		}
	}

	public async updatePassword(body: { userId: string; email: string; oldPassword: string; newPassword: string }): Promise<unknown> {
		const className = UsersService.name;
		const functionName = this.updatePassword.name;
		try {
			const verifyUser = await this.usersDAO.getUserByEmail(body.email, null, null, true);
			if (hasValue(verifyUser)) {
				if (verifyUser.password) {
					const verifyPassword = await BcryptHelper.comparePassword(body.oldPassword, verifyUser.password);
					if (!verifyPassword) {
						throw new AppError('Bad Request, Reason: invalid password', 409);
					} else {
						const hashedPassword: string = await BcryptHelper.hashPassword(body.newPassword);
						const user = await this.usersDAO.updateUserById({ password: hashedPassword }, body.userId);
						if (hasValue(user)) {
							return user;
						} else {
							throw new AppError('User not found', 404);
						}
					}
				} else {
					throw new AppError('User not found', 404);
				}
			} else {
				throw new AppError('User not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'updatePassword catch error', error, className });
			throw error;
		}
	}
}

export { UsersService };
