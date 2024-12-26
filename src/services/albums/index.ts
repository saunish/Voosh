import { AlbumsDAO, AlbumInterface } from '../../data-access-layer/mysql/index.js';
import { AppError, hasValue } from '../../utils/index.js';
import { logger } from '../../utils/logger.js';

class AlbumsService {
	private albumsDAO = new AlbumsDAO();

	public async getAllAlbums(body: { limit: number; offset: number; filters: { year?: number; hidden?: boolean; artistId?: string } }): Promise<unknown> {
		const className = AlbumsService.name;
		const functionName = this.getAllAlbums.name;
		try {
			const albums = await this.albumsDAO.getAllAlbums(body.filters, null, null, body.limit, body.offset);
			if (hasValue(albums)) {
				return albums;
			} else {
				throw new AppError('No albums found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAllAlbums catch error', error, className });
			throw error;
		}
	}

	public async getAlbumById(albumId: string): Promise<AlbumInterface | null> {
		const className = AlbumsService.name;
		const functionName = this.getAlbumById.name;
		try {
			const album = await this.albumsDAO.getAlbumById(albumId);
			if (hasValue(album)) {
				return album as AlbumInterface;
			} else {
				throw new AppError('Album not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'getAlbumById catch error', error, className });
			throw error;
		}
	}

	public async addAlbum(body: AlbumInterface): Promise<unknown> {
		const className = AlbumsService.name;
		const functionName = this.addAlbum.name;
		try {
			const verifyAlbum = await this.albumsDAO.getAlbumByName(body.name);
			if (hasValue(verifyAlbum)) {
				throw new AppError('Album ID already exists.', 409);
			}

			const album = await this.albumsDAO.createAlbum(body);
			if (hasValue(album)) {
				return album;
			} else {
				throw new AppError('Album not added', 409);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'addAlbum catch error', error, className });
			throw error;
		}
	}

	public async deleteAlbum(albumId: string): Promise<unknown> {
		const className = AlbumsService.name;
		const functionName = this.deleteAlbum.name;
		try {
			const verifyAlbum = await this.albumsDAO.getAlbumById(albumId);
			if (!hasValue(verifyAlbum)) {
				throw new AppError('No such album ID exists', 404);
			}
			const album = await this.albumsDAO.deleteAlbum(albumId);
			if (hasValue(album)) {
				return album;
			} else {
				throw new AppError('Album not found', 404);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'deleteAlbum catch error', error, className });
			throw error;
		}
	}

	public async updateAlbumDetails(albumId: string, body: Partial<AlbumInterface>): Promise<unknown> {
		const className = AlbumsService.name;
		const functionName = this.updateAlbumDetails.name;
		try {
			const verifyAlbum = await this.albumsDAO.getAlbumById(albumId);
			if (!hasValue(verifyAlbum)) {
				throw new AppError('No such album ID exists', 404);
			} else {
				const album = await this.albumsDAO.updateAlbumById(body, albumId);
				if (hasValue(album)) {
					return album;
				} else {
					throw new AppError('Album not found', 404);
				}
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'updateAlbumDetails catch error', error, className });
			throw error;
		}
	}
}

export { AlbumsService };
