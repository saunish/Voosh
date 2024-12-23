import { KnexClient } from '../../boot/knex.js';
import { UserInterface } from '../../types/index.js';

class UsersDAO {
	public async createUser(userData: UserInterface): Promise<UserInterface> {
		try {
			const [insertId] = await KnexClient.mysqlClient<UserInterface>('users').insert({
				username: userData.username,
				email: userData.email,
				isEmailVerified: userData.isEmailVerified ?? false,
				mobile: userData.mobile ?? '0',
				isMobileVerified: userData.isMobileVerified ?? false,
				roleId: userData.roleId,
				isSso: userData.isSso ?? false,
				active: userData.active ?? true,
				archive: userData.archive ?? false,
				createdDate: new Date(),
				updatedDate: new Date(),
			});
			const createdUser: UserInterface = (await KnexClient.mysqlClient<UserInterface>('users').where('userId', insertId).first()) as UserInterface;
			if (!createdUser) {
				throw new Error('Failed to retrieve the created user.');
			}

			return createdUser;
		} catch (error) {
			console.error('Error creating user:', error);
			throw error;
		}
	}

	public async getUserByEmailId(emailId: string): Promise<UserInterface> {
		const user = await KnexClient.mysqlClient<UserInterface>('users').where('email', emailId).first();
		if (!user) {
			throw new Error('Failed to retrieve user with email id');
		}
		return user;
	}
}

export { UsersDAO };
