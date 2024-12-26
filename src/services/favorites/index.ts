import { FavoritesDAO, FavoriteInterface } from '../../data-access-layer/mysql/index.js';
import { AppError, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class FavoritesService {
	private favoritesDAO = new FavoritesDAO();

	public async getFavorites(body: { category: string; limit: number; offset: number }): Promise<unknown> {
		const className = FavoritesService.name;
		const functionName = this.getFavorites.name;
		try {
			const favorites = await this.favoritesDAO.getFavoritesByCategory(body.category, body.limit, body.offset);
			if (hasValue(favorites)) {
				return favorites;
			} else {
				throw new AppError('No favorites found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getFavorites catch error', error, className });
			throw error;
		}
	}

	public async addFavorite(body: FavoriteInterface): Promise<unknown> {
		const className = FavoritesService.name;
		const functionName = this.addFavorite.name;
		try {
			const existingFavorite = await this.favoritesDAO.getFavoriteByCategoryAndItemId(body.category, body.itemId, body.userId);
			if (hasValue(existingFavorite)) {
				throw new AppError('Favorite already exists', 409);
			}

			const favorite = await this.favoritesDAO.createFavorite(body);
			if (hasValue(favorite)) {
				return favorite;
			} else {
				throw new AppError('Favorite not added', 409);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addFavorite catch error', error, className });
			throw error;
		}
	}

	public async removeFavorite(favoriteId: string): Promise<unknown> {
		const className = FavoritesService.name;
		const functionName = this.removeFavorite.name;
		try {
			const existingFavorite = await this.favoritesDAO.getFavoriteById(favoriteId);
			if (!hasValue(existingFavorite)) {
				throw new AppError('Favorite not found', 404);
			}

			const result = await this.favoritesDAO.deleteFavoriteById(favoriteId);
			if (hasValue(result)) {
				return result;
			} else {
				throw new AppError('Favorite could not be removed', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'removeFavorite catch error', error, className });
			throw error;
		}
	}
}

export { FavoritesService };
