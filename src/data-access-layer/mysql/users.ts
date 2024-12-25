import { KnexClient } from '../../boot/knex.js';
import { getSelectFields } from '../../utils/index.js';

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
			console.error('Error creating user:', error);
			throw error;
		}
	}

	public async getUserByEmail(
		email: string,
		includedFields: (keyof UserInterface)[] | null = null,
		excludedFields: (keyof UserInterface)[] | null = null,
	): Promise<Partial<UserInterface>> {
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);
			const user: UserInterface = (await KnexClient.mysqlClient<UserInterface>(tableName).select(selectFields).where('email', email).first()) as unknown as UserInterface;
			return user;
		} catch (error) {
			console.error('Error getting user by email:', error);
			throw error;
		}
	}
}

export { UsersDAO, UserInterface };
