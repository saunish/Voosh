import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { TracksService } from '../services/tracks/index.js';
import { STATUS_CODE } from '../configs/response-codes.js';

class TracksController {
	private tracksServices = new TracksService();

	public getAllTracks = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = TracksController.name;
		const functionName = this.getAllTracks.name;
		try {
			const payload = {
				limit: Number(req.query.limit) || 5,
				offset: Number(req.query.offset) || 0,
				filters: {
					albumId: req.query.albumId ? String(req.query.albumId) : undefined,
					hidden: req.query.hidden ? req.query.hidden === 'true' : undefined,
					artistId: req.query.artistId ? String(req.query.artistId) : undefined,
				},
			};
			const tracks = await this.tracksServices.getAllTracks(payload);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: tracks, message: 'tracks fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getAllTracks catch error', error, className });
			return next(error);
		}
	};

	public getTrack = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = TracksController.name;
		const functionName = this.getTrack.name;
		try {
			const track = await this.tracksServices.getTrackById(req.params.trackId);
			if (!track) {
				return res.status(STATUS_CODE.NOT_FOUND).json({ status: STATUS_CODE.NOT_FOUND, data: null, message: 'Track not found', error: null });
			}
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: track, message: 'track fetched successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'getTrack catch error', error, className });
			return next(error);
		}
	};

	public addTrack = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = TracksController.name;
		const functionName = this.addTrack.name;
		try {
			await this.tracksServices.addTrack(req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'track added successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'addTrack catch error', error, className });
			return next(error);
		}
	};

	public deleteTrack = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = TracksController.name;
		const functionName = this.deleteTrack.name;
		try {
			await this.tracksServices.deleteTrack(req.params.trackId);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: null, message: 'track deleted successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'deleteTrack catch error', error, className });
			return next(error);
		}
	};

	public updateTrackDetails = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
		const className = TracksController.name;
		const functionName = this.updateTrackDetails.name;
		try {
			const track = await this.tracksServices.updateTrackDetails(req.params.trackId, req.body);
			return res.status(STATUS_CODE.SUCCESS).json({ status: STATUS_CODE.SUCCESS, data: track, message: 'track details updated successfully', error: null });
		} catch (error) {
			logger.error({ functionName, message: 'updateTrackDetails catch error', error, className });
			return next(error);
		}
	};
}

export { TracksController };
