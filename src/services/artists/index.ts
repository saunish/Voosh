import { ArtistsDAO, ArtistInterface } from '../../data-access-layer/mysql/index.js';
import { AppError, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class ArtistsService {
	private artistsDAO = new ArtistsDAO();

	public async getAllArtists(body: { limit: number; offset: number; filters: { grammy?: number; hidden?: boolean } }): Promise<unknown> {
		const className = ArtistsService.name;
		const functionName = this.getAllArtists.name;
		try {
			const artists = await this.artistsDAO.getAllArtists(body.filters, null, null, body.limit, body.offset);
			if (hasValue(artists)) {
				return artists;
			} else {
				throw new AppError('No artists found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAllArtists catch error', error, className });
			throw error;
		}
	}

	public async getArtistById(artistId: string): Promise<ArtistInterface | null> {
		const className = ArtistsService.name;
		const functionName = this.getArtistById.name;
		try {
			const artist = await this.artistsDAO.getArtistById(artistId);
			if (hasValue(artist)) {
				return artist as ArtistInterface;
			} else {
				throw new AppError('Artist not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getArtistById catch error', error, className });
			throw error;
		}
	}

	public async addArtist(body: ArtistInterface): Promise<unknown> {
		const className = ArtistsService.name;
		const functionName = this.addArtist.name;
		try {
			const verifyArtist = await this.artistsDAO.getArtistByName(body.name);
			if (hasValue(verifyArtist)) {
				throw new AppError('Artist ID already exists.', 409);
			}

			const artist = await this.artistsDAO.createArtist(body);
			if (hasValue(artist)) {
				return artist;
			} else {
				throw new AppError('Artist not added', 409);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addArtist catch error', error, className });
			throw error;
		}
	}

	public async deleteArtist(artistId: string): Promise<unknown> {
		const className = ArtistsService.name;
		const functionName = this.deleteArtist.name;
		try {
			const verifyArtist = await this.artistsDAO.getArtistById(artistId);
			if (!hasValue(verifyArtist)) {
				throw new AppError('No such artist ID exists', 404);
			}
			const artist = await this.artistsDAO.deleteArtist(artistId);
			if (hasValue(artist)) {
				return artist;
			} else {
				throw new AppError('Artist not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'deleteArtist catch error', error, className });
			throw error;
		}
	}

	public async updateArtistDetails(artistId: string, body: Partial<ArtistInterface>): Promise<unknown> {
		const className = ArtistsService.name;
		const functionName = this.updateArtistDetails.name;
		try {
			const verifyArtist = await this.artistsDAO.getArtistById(artistId);
			if (!hasValue(verifyArtist)) {
				throw new AppError('No such artist ID exists', 404);
			} else {
				const artist = await this.artistsDAO.updateArtistById(body, artistId);
				if (hasValue(artist)) {
					return artist;
				} else {
					throw new AppError('Artist not found', 404);
				}
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'updateArtistDetails catch error', error, className });
			throw error;
		}
	}
}

export { ArtistsService };
