import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { AlbumsService } from '../services/albums/index.js';
import { STATUS_CODE } from '../configs/response-codes.js';

class AlbumsController {
	private albumsServices = new AlbumsService();

	public getAllAlbums = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AlbumsController.name;
		const functionName = this.getAllAlbums.name;
		try {
			const payload = {
				limit: Number(req.query.limit) || 5,
				offset: Number(req.query.offset) || 5,
				filters: {
					year: req.query.year ? Number(req.query.year) : undefined,
					hidden: req.query.hidden ? req.query.hidden === 'true' : undefined,
					artistId: req.query.artistId ? String(req.query.artistId) : undefined,
				},
			};
			const albums = await this.albumsServices.getAllAlbums(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: albums, message: 'albums fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAllAlbums catch error', error, className });
			return next(error);
		}
	};

	public getAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AlbumsController.name;
		const functionName = this.getAlbum.name;
		try {
			const album = await this.albumsServices.getAlbumById(req.params.albumId);
			if (!album) {
				return res.status(STATUS_CODE.NOT_FOUND).json({ status: STATUS_CODE.NOT_FOUND, data: null, message: 'Album not found', error: null });
			}
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: album, message: 'album fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAlbum catch error', error, className });
			return next(error);
		}
	};

	public addAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AlbumsController.name;
		const functionName = this.addAlbum.name;
		try {
			await this.albumsServices.addAlbum(req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'album added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addAlbum catch error', error, className });
			return next(error);
		}
	};

	public deleteAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AlbumsController.name;
		const functionName = this.deleteAlbum.name;
		try {
			await this.albumsServices.deleteAlbum(req.params.albumId);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'album deleted successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'deleteAlbum catch error', error, className });
			return next(error);
		}
	};

	public updateAlbumDetails = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = AlbumsController.name;
		const functionName = this.updateAlbumDetails.name;
		try {
			const album = await this.albumsServices.updateAlbumDetails(req.params.albumId, req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: album, message: 'album details updated successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'updateAlbumDetails catch error', error, className });
			return next(error);
		}
	};
}

export { AlbumsController };
