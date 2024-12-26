import { KnexClient } from '../../boot/knex.js';
import { AppError, getSelectFields, logger } from '../../utils/index.js';

const tableName = 'albums';

const AlbumSchema = {
	albumId: 'string',
	artistId: 'string',
	name: 'string',
	year: 'integer',
	hidden: 'boolean',
	createdDate: 'Date',
	updatedDate: 'Date',
} as const;

const ALL_FIELDS = Object.keys(AlbumSchema) as (keyof typeof AlbumSchema)[];

type AlbumInterface = {
	[K in keyof typeof AlbumSchema]: K extends 'createdDate' | 'updatedDate' ? Date : K extends 'hidden' ? boolean : K extends 'year' ? number : string;
};

class AlbumsDAO {
	private readonly defaultExcludedFields: (keyof AlbumInterface)[] = [];

	public async createAlbum(albumData: AlbumInterface): Promise<string | void> {
		const className = AlbumsDAO.name;
		const functionName = this.createAlbum.name;
		try {
			const [_insertId] = await KnexClient.mysqlClient<AlbumInterface>(tableName).insert({
				albumId: albumData.albumId,
				artistId: albumData.artistId,
				name: albumData.name,
				year: albumData.year,
				hidden: albumData.hidden,
				createdDate: new Date(),
				updatedDate: new Date(),
			});

			return 'insert successful';
		} catch (error) {
			logger.error({ className, functionName, message: 'Error creating album', error });
			throw new AppError('Error creating album', 500, error);
		}
	}

	public async getAlbumById(
		albumId: string,
		includedFields: (keyof AlbumInterface)[] | null = null,
		excludedFields: (keyof AlbumInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<AlbumInterface>> {
		const className = AlbumsDAO.name;
		const functionName = this.getAlbumById.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const album: AlbumInterface = (await KnexClient.mysqlClient<AlbumInterface>(tableName).select(selectFields).where({ albumId }).first()) as unknown as AlbumInterface;
			return album;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting album by ID', error });
			throw new AppError('Error getting album by ID', 500, error);
		}
	}

	public async getAlbumByName(
		name: string,
		includedFields: (keyof AlbumInterface)[] | null = null,
		excludedFields: (keyof AlbumInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<AlbumInterface>> {
		const className = AlbumsDAO.name;
		const functionName = this.getAlbumById.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const album: AlbumInterface = (await KnexClient.mysqlClient<AlbumInterface>(tableName).select(selectFields).where({ name }).first()) as unknown as AlbumInterface;
			return album;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting album by Name', error });
			throw new AppError('Error getting album by Name', 500, error);
		}
	}

	public async getAlbumsByArtistId(
		artistId: string,
		includedFields: (keyof AlbumInterface)[] | null = null,
		excludedFields: (keyof AlbumInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<AlbumInterface>[]> {
		const className = AlbumsDAO.name;
		const functionName = this.getAlbumsByArtistId.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const albums = (await KnexClient.mysqlClient<AlbumInterface>(tableName).select(selectFields).where({ artistId })) as unknown as AlbumInterface[];
			return albums;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting albums by artist ID', error });
			throw new AppError('Error getting albums by artist ID', 500, error);
		}
	}

	public async updateAlbumById(albumUpdateDetails: Partial<AlbumInterface>, albumId: string): Promise<Partial<AlbumInterface>> {
		const className = AlbumsDAO.name;
		const functionName = this.updateAlbumById.name;
		try {
			await KnexClient.mysqlClient<AlbumInterface>(tableName).where('albumId', albumId).update(albumUpdateDetails);
			const updatedAlbum = await this.getAlbumById(albumId);
			return updatedAlbum;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error updating album by ID', error });
			throw new AppError('Error updating album by ID', 500, error);
		}
	}

	public async deleteAlbum(albumId: string): Promise<void> {
		const className = AlbumsDAO.name;
		const functionName = this.deleteAlbum.name;
		try {
			return await KnexClient.mysqlClient<AlbumInterface>(tableName).where('albumId', albumId).del();
		} catch (error) {
			logger.error({ className, functionName, message: 'Error deleting album', error });
			throw new AppError('Error deleting album', 500, error);
		}
	}

	public async getAllAlbums(
		filters: { year?: number; hidden?: boolean; artistId?: string } = {},
		includedFields: (keyof AlbumInterface)[] | null = null,
		excludedFields: (keyof AlbumInterface)[] | null = null,
		limit: number | null = 5,
		offset: number | null = 0,
	) {
		const className = AlbumsDAO.name;
		const functionName = this.getAllAlbums.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);
			let query = KnexClient.mysqlClient<AlbumInterface>(tableName).select(selectFields).orderBy('createdDate', 'asc');

			if (filters.year !== undefined) {
				query = query.where('year', filters.year);
			}
			if (filters.hidden !== undefined) {
				query = query.where('hidden', filters.hidden);
			}
			if (filters.artistId !== undefined) {
				query = query.where('artistId', filters.artistId);
			}
			if (limit !== null) {
				query = query.limit(limit);
			}
			if (offset !== null) {
				query = query.offset(offset);
			}

			const albums = await query;
			return albums;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error fetching all albums', error });
			throw new AppError('Error fetching all albums', 500, error);
		}
	}
}

export { AlbumsDAO, AlbumInterface };
