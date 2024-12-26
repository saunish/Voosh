import { KnexClient } from '../../boot/knex.js';
import { AppError, getSelectFields, logger } from '../../utils/index.js';

const tableName = 'users';

const UserSchema = {
	userId: 'string',
	email: 'string',
	password: 'string',
	role: 'string',
	parentId: 'string | null',
	createdDate: 'Date',
	updatedDate: 'Date',
} as const;

const ALL_FIELDS = Object.keys(UserSchema) as (keyof typeof UserSchema)[];

type UserInterface = {
	[K in keyof typeof UserSchema]: K extends 'createdDate' | 'updatedDate' ? Date : K extends 'parentId' ? string | null : string;
};

class UsersDAO {
	private readonly defaultExcludedFields: (keyof UserInterface)[] = ['password', 'parentId'];

	public async createUser(
		userData: UserInterface,
		includedFields: (keyof UserInterface)[] | null = null,
		excludedFields: (keyof UserInterface)[] | null = null,
	): Promise<Partial<UserInterface>> {
		const className = UsersDAO.name;
		const functionName = this.createUser.name;
		try {
			const [insertId] = await KnexClient.mysqlClient<UserInterface>(tableName).insert({
				userId: userData.userId,
				email: userData.email,
				password: userData.password,
				role: userData.role,
				parentId: userData.parentId,
				createdDate: new Date(),
				updatedDate: new Date(),
			});

			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);

			const createdUser: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName)
				.select(selectFields)
				.where('userId', insertId)
				.first()) as unknown as UserInterface;

			return createdUser;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error creating user', error });
			throw new AppError('Error creating user', 500, error);
		}
	}

	public async getUserByEmail(
		email: string,
		includedFields: (keyof UserInterface)[] | null = null,
		excludedFields: (keyof UserInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<UserInterface>> {
		const className = UsersDAO.name;
		const functionName = this.getUserByEmail.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const user: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName).select(selectFields).where('email', email).first()) as unknown as UserInterface;
			return user;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting user by email', error });
			throw new AppError('Error getting user by email', 500, error);
		}
	}

	public async getUserById(
		userId: string,
		includedFields: (keyof UserInterface)[] | null = null,
		excludedFields: (keyof UserInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<UserInterface>> {
		const className = UsersDAO.name;
		const functionName = this.getUserById.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const user: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName).select(selectFields).where({ userId }).first()) as unknown as UserInterface;
			return user;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting user by userId', error });
			throw new AppError('Error getting user by userId', 500, error);
		}
	}

	public async getAllUsersByParentId(
		parentId: string,
		includedFields: (keyof UserInterface)[] | null = null,
		excludedFields: (keyof UserInterface)[] | null = null,
		limit: number | null = null,
		offset: number | null = null,
	) {
		const className = UsersDAO.name;
		const functionName = this.getAllUsersByParentId.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);
			let query = KnexClient.mysqlClient<UserInterface>(tableName).select(selectFields).where('parentId', parentId).orderBy('createdDate', 'asc');
			if (limit !== null) {
				query = query.limit(limit);
			}
			if (offset !== null) {
				query = query.offset(offset);
			}
			const users = await query;
			return users;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting all users by parentId', error });
			throw new AppError('Error getting all users by parentId', 500, error);
		}
	}

	public async deleteUser(userId: string): Promise<Partial<UserInterface>> {
		const className = UsersDAO.name;
		const functionName = this.deleteUser.name;
		try {
			const user: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName).where('userId', userId).del()) as unknown as UserInterface;
			return user;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error deleting user by userId', error });
			throw new AppError('Error deleting user by userId', 500, error);
		}
	}

	public async updateUserById(userUpdateDetails: Partial<UserInterface>, userId: string): Promise<Partial<UserInterface>> {
		const className = UsersDAO.name;
		const functionName = this.updateUserById.name;
		try {
			const user: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName).where('userId', userId).update(userUpdateDetails)) as unknown as UserInterface;
			return user;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error updating user by userId', error });
			throw new AppError('Error updating user by userId', 500, error);
		}
	}
}

export { UsersDAO, UserInterface };
