import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { FavoritesService } from '../services/favorites/index.js';
import { STATUS_CODE } from '../configs/response-codes.js';

class FavoritesController {
	private favoritesService = new FavoritesService();

	/**
	 * Retrieve favorites based on the category
	 */
	public getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = FavoritesController.name;
		const functionName = this.getFavorites.name;
		try {
			const payload = {
				category: req.params.category,
				limit: Number(req.query.limit) || 5,
				offset: Number(req.query.offset) || 0,
			};
			const favorites = await this.favoritesService.getFavorites(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: favorites, message: 'favorites fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getFavorites catch error', error, className });
			return next(error);
		}
	};

	/**
	 * Add a new favorite item
	 */
	public addFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = FavoritesController.name;
		const functionName = this.addFavorite.name;
		try {
			const payload = {
				...req.body,
				...req.user,
			};
			await this.favoritesService.addFavorite(payload);
			return res.status(STATUS_CODE.CREATED).json({ status: STATUS_CODE.CREATED, data: null, message: 'favorite added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addFavorite catch error', error, className });
			return next(error);
		}
	};

	/**
	 * Remove a favorite item by ID
	 */
	public removeFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = FavoritesController.name;
		const functionName = this.removeFavorite.name;
		try {
			await this.favoritesService.removeFavorite(req.params.id);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'favorite removed successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'removeFavorite catch error', error, className });
			return next(error);
		}
	};
}

export { FavoritesController };
