import { UsersDAO, UserInterface } from '../../data-access-layer/mysql/users.js';
import { BcryptHelper } from '../../utils/bcrypt-helper.js';
import { AppError, generateToken, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';
import jwt from 'jsonwebtoken';
import { setCache } from '../../utils/redis-helper.js';
import { CreateHttpResponseInterface } from '../../utils/create-http-response.js';

class AuthService {
	private usersDAO = new UsersDAO();

	public async createUser(userData: UserInterface): Promise<Partial<UserInterface> | CreateHttpResponseInterface> {
		const className = AuthService.name;
		const functionName = this.createUser.name;
		try {
			const verifyUser = await this.usersDAO.getUserByEmail(userData.email);
			if (hasValue(verifyUser)) {
				throw new AppError('Email already exists.', 409);
			}
			const hashedPassword: string = await BcryptHelper.hashPassword(userData.password);
			const user = {
				...userData,
				password: hashedPassword,
				role: 'admin',
			};
			return Promise.resolve(await this.usersDAO.createUser(user));
		} catch (error: unknown) {
			logger.error({ functionName, message: 'createUser catch error', error, className });
			throw error;
		}
	}

	public async login(userData: UserInterface): Promise<unknown> {
		const className = AuthService.name;
		const functionName = this.login.name;
		try {
			const verifyUser = (await this.usersDAO.getUserByEmail(userData.email, null, null, true)) as UserInterface;
			if (!hasValue(verifyUser)) {
				throw new AppError('User not found.', 409);
			}
			const verifyPassword = await BcryptHelper.comparePassword(userData.password, verifyUser.password);
			if (!verifyPassword) {
				throw new AppError('Bad Request, Invalid password.', 409);
			} else {
				const payload = { userId: verifyUser.userId, email: verifyUser.email, role: verifyUser.role };
				return Promise.resolve(generateToken(payload));
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'login catch error', error, className });
			throw error;
		}
	}

	public async logout(token: string): Promise<unknown> {
		const className = AuthService.name;
		const functionName = this.logout.name;
		try {
			const decoded = jwt.decode(token) as { exp: number };
			const expiry = decoded.exp - Math.floor(Date.now() / 1000);
			if (expiry > 0) {
				await setCache(token, 'blacklisted', expiry);
			}
			return { status: 200, data: null, message: 'User logged out successfully', error: null };
		} catch (error: unknown) {
			logger.error({ functionName, message: 'logout catch error', error, className });
			throw error;
		}
	}
}

export { AuthService };
