import { KnexClient } from '../../boot/knex.js';
import { AppError, getSelectFields, logger } from '../../utils/index.js';

const tableName = 'favorites';

const FavoriteSchema = {
	favoriteId: 'string',
	userId: 'string',
	category: 'string',
	itemId: 'string',
	createdDate: 'Date',
} as const;

const ALL_FIELDS = Object.keys(FavoriteSchema) as (keyof typeof FavoriteSchema)[];

type FavoriteInterface = {
	[K in keyof typeof FavoriteSchema]: K extends 'createdDate' ? Date : string;
};

class FavoritesDAO {
	private readonly defaultExcludedFields: (keyof FavoriteInterface)[] = [];

	public async createFavorite(favoriteData: FavoriteInterface): Promise<string | void> {
		const className = FavoritesDAO.name;
		const functionName = this.createFavorite.name;
		try {
			const [_insertId] = await KnexClient.mysqlClient<FavoriteInterface>(tableName).insert({
				favoriteId: favoriteData.favoriteId,
				userId: favoriteData.userId,
				category: favoriteData.category,
				itemId: favoriteData.itemId,
				createdDate: new Date(),
			});

			return 'insert successful';
		} catch (error) {
			logger.error({ className, functionName, message: 'Error creating favorite', error });
			throw new AppError('Error creating favorite', 500, error);
		}
	}

	public async getFavoritesByCategory(category: string, limit: number = 5, offset: number = 0): Promise<Partial<FavoriteInterface>[]> {
		const className = FavoritesDAO.name;
		const functionName = this.getFavoritesByCategory.name;
		try {
			const selectFields = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, null, null);
			const favorites = await KnexClient.mysqlClient<FavoriteInterface>(tableName)
				.select(selectFields)
				.where({ category })
				.limit(limit)
				.offset(offset)
				.orderBy('createdDate', 'desc');

			return favorites;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting favorites by category', error });
			throw new AppError('Error getting favorites by category', 500, error);
		}
	}

	public async getFavoriteById(favoriteId: string): Promise<Partial<FavoriteInterface> | null> {
		const className = FavoritesDAO.name;
		const functionName = this.getFavoriteById.name;
		try {
			const selectFields = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, null, null);
			const favorite = await KnexClient.mysqlClient<FavoriteInterface>(tableName).select(selectFields).where({ favoriteId }).first();

			return favorite || null;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting favorite by ID', error });
			throw new AppError('Error getting favorite by ID', 500, error);
		}
	}

	public async getFavoriteByCategoryAndItemId(category: string, itemId: string, userId: string): Promise<Partial<FavoriteInterface> | null> {
		const className = FavoritesDAO.name;
		const functionName = this.getFavoriteByCategoryAndItemId.name;
		try {
			const selectFields = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, null, null);
			const favorite = await KnexClient.mysqlClient<FavoriteInterface>(tableName).select(selectFields).where({ category, itemId, userId }).first();

			return favorite || null;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting favorite by category and item ID', error });
			throw new AppError('Error getting favorite by category and item ID', 500, error);
		}
	}

	public async deleteFavoriteById(favoriteId: string): Promise<void | string> {
		const className = FavoritesDAO.name;
		const functionName = this.deleteFavoriteById.name;
		try {
			await KnexClient.mysqlClient<FavoriteInterface>(tableName).where({ favoriteId }).del();
			return 'delete successfull';
		} catch (error) {
			logger.error({ className, functionName, message: 'Error deleting favorite by ID', error });
			throw new AppError('Error deleting favorite by ID', 500, error);
		}
	}
}

export { FavoritesDAO, FavoriteInterface };
