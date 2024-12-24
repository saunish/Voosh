import { KnexClient } from '../../boot/knex.js';
import { UserInterface } from '../../types/index.js';
import { Helpers } from '../../utils/index.js';

const tableName = 'users';

class UsersDAO {
	public async createUser(userData: UserInterface): Promise<UserInterface> {
		try {
			const [insertId] = await KnexClient.mysqlClient<UserInterface>(tableName).insert({
				userId: userData.userId,
				email: userData.email,
				password: userData.password,
				role: userData.role,
				parent_id: userData.parent_id,
				createdDate: new Date(),
				updatedDate: new Date(),
			});
			const selectFields: string[] = await Helpers.selectAllExcept(tableName, ['password']);
			const createdUser: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName)
				.select(selectFields)
				.where('user_id', insertId)
				.first()) as unknown as UserInterface;
			if (!createdUser) {
				throw new Error('Failed to retrieve the created user.');
			}
			return createdUser;
		} catch (error) {
			console.error('Error creating user:', error);
			throw error;
		}
	}
}

export { UsersDAO };
