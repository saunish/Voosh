import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { ArtistsService } from '../services/artists/index.js';
import { STATUS_CODE } from '../configs/response-codes.js';

class ArtistsController {
	private artistsServices = new ArtistsService();

	public getAllArtists = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = ArtistsController.name;
		const functionName = this.getAllArtists.name;
		try {
			const payload = {
				limit: Number(req.query.limit) || 5,
				offset: Number(req.query.offset) || 5,
				filters: {
					grammy: req.query.grammy ? Number(req.query.grammy) : undefined,
					hidden: req.query.hidden ? req.query.hidden === 'true' : undefined,
				},
			};
			const artists = await this.artistsServices.getAllArtists(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: artists, message: 'artists fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAllArtists catch error', error, className });
			return next(error);
		}
	};

	public addArtist = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = ArtistsController.name;
		const functionName = this.addArtist.name;
		try {
			await this.artistsServices.addArtist(req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'artist added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addArtist catch error', error, className });
			return next(error);
		}
	};

	public deleteArtist = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = ArtistsController.name;
		const functionName = this.deleteArtist.name;
		try {
			await this.artistsServices.deleteArtist(req.params.artistId);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'artist deleted successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'deleteArtist catch error', error, className });
			return next(error);
		}
	};

	public updateArtistDetails = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = ArtistsController.name;
		const functionName = this.updateArtistDetails.name;
		try {
			const artist = await this.artistsServices.updateArtistDetails(req.params.artistId, req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: artist, message: 'artist details updated successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'updateArtistDetails catch error', error, className });
			return next(error);
		}
	};
}

export { ArtistsController };
