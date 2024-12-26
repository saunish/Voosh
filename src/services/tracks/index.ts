import { TracksDAO, TrackInterface } from '../../data-access-layer/mysql/index.js';
import { AppError, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class TracksService {
	private tracksDAO = new TracksDAO();

	public async getAllTracks(body: { limit: number; offset: number; filters: { albumId?: string; hidden?: boolean; artistId?: string } }): Promise<unknown> {
		const className = TracksService.name;
		const functionName = this.getAllTracks.name;
		try {
			const tracks = await this.tracksDAO.getAllTracks(body.filters, null, null, body.limit, body.offset);
			if (hasValue(tracks)) {
				return tracks;
			} else {
				throw new AppError('No tracks found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAllTracks catch error', error, className });
			throw error;
		}
	}

	public async getTrackById(trackId: string): Promise<TrackInterface | null> {
		const className = TracksService.name;
		const functionName = this.getTrackById.name;
		try {
			const track = await this.tracksDAO.getTrackById(trackId);
			if (hasValue(track)) {
				return track as TrackInterface;
			} else {
				throw new AppError('Track not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getTrackById catch error', error, className });
			throw error;
		}
	}

	public async addTrack(body: TrackInterface): Promise<unknown> {
		const className = TracksService.name;
		const functionName = this.addTrack.name;
		try {
			const verifyTrack = await this.tracksDAO.getTracksByAlbumId(body.albumId);
			if (verifyTrack.some((track) => track.name === body.name)) {
				throw new AppError('Track name already exists in the album.', 409);
			}

			const track = await this.tracksDAO.createTrack(body);
			if (hasValue(track)) {
				return track;
			} else {
				throw new AppError('Track not added', 409);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addTrack catch error', error, className });
			throw error;
		}
	}

	public async deleteTrack(trackId: string): Promise<unknown> {
		const className = TracksService.name;
		const functionName = this.deleteTrack.name;
		try {
			const verifyTrack = await this.tracksDAO.getTrackById(trackId);
			if (!hasValue(verifyTrack)) {
				throw new AppError('No such track ID exists', 404);
			}
			const track = await this.tracksDAO.deleteTrack(trackId);
			if (hasValue(track)) {
				return track;
			} else {
				throw new AppError('Track not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'deleteTrack catch error', error, className });
			throw error;
		}
	}

	public async updateTrackDetails(trackId: string, body: Partial<TrackInterface>): Promise<unknown> {
		const className = TracksService.name;
		const functionName = this.updateTrackDetails.name;
		try {
			const verifyTrack = await this.tracksDAO.getTrackById(trackId);
			if (!hasValue(verifyTrack)) {
				throw new AppError('No such track ID exists', 404);
			} else {
				const track = await this.tracksDAO.updateTrackById(body, trackId);
				if (hasValue(track)) {
					return track;
				} else {
					throw new AppError('Track not found', 404);
				}
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'updateTrackDetails catch error', error, className });
			throw error;
		}
	}
}

export { TracksService };
