import { KnexClient } from '../../boot/knex.js';
import { AppError, getSelectFields, logger } from '../../utils/index.js';

const tableName = 'artists';

const ArtistSchema = {
	artistId: 'string',
	name: 'string',
	grammy: 'integer',
	hidden: 'boolean',
	createdDate: 'Date',
	updatedDate: 'Date',
} as const;

const ALL_FIELDS = Object.keys(ArtistSchema) as (keyof typeof ArtistSchema)[];

type ArtistInterface = {
	[K in keyof typeof ArtistSchema]: K extends 'createdDate' | 'updatedDate' ? Date : K extends 'hidden' ? boolean : K extends 'grammy' ? number : string;
};

class ArtistsDAO {
	private readonly defaultExcludedFields: (keyof ArtistInterface)[] = [];

	public async createArtist(artistData: ArtistInterface): Promise<string | void> {
		const className = ArtistsDAO.name;
		const functionName = this.createArtist.name;
		try {
			const [_insertId] = await KnexClient.mysqlClient<ArtistInterface>(tableName).insert({
				artistId: artistData.artistId,
				name: artistData.name,
				grammy: artistData.grammy,
				hidden: artistData.hidden,
				createdDate: new Date(),
				updatedDate: new Date(),
			});

			return 'insert successfull';
		} catch (error) {
			logger.error({ className, functionName, message: 'Error creating artist', error });
			throw new AppError('Error creating artist', 500, error);
		}
	}

	public async getArtistById(
		artistId: string,
		includedFields: (keyof ArtistInterface)[] | null = null,
		excludedFields: (keyof ArtistInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<ArtistInterface>> {
		const className = ArtistsDAO.name;
		const functionName = this.getArtistById.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const artist: ArtistInterface = (await KnexClient.mysqlClient<ArtistInterface>(tableName).select(selectFields).where({ artistId }).first()) as unknown as ArtistInterface;
			return artist;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting artist by ID', error });
			throw new AppError('Error getting artist by ID', 500, error);
		}
	}

	public async getArtistByName(
		name: string,
		includedFields: (keyof ArtistInterface)[] | null = null,
		excludedFields: (keyof ArtistInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<ArtistInterface>> {
		const className = ArtistsDAO.name;
		const functionName = this.getArtistByName.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const artist: ArtistInterface = (await KnexClient.mysqlClient<ArtistInterface>(tableName).select(selectFields).where({ name }).first()) as unknown as ArtistInterface;
			return artist;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting artist by Name', error });
			throw new AppError('Error getting artist by Name', 500, error);
		}
	}

	public async updateArtistById(artistUpdateDetails: Partial<ArtistInterface>, artistId: string): Promise<Partial<ArtistInterface>> {
		const className = ArtistsDAO.name;
		const functionName = this.updateArtistById.name;
		try {
			await KnexClient.mysqlClient<ArtistInterface>(tableName).where('artistId', artistId).update(artistUpdateDetails);
			const updatedArtist = await this.getArtistById(artistId);
			return updatedArtist;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error updating artist by ID', error });
			throw new AppError('Error updating artist by ID', 500, error);
		}
	}

	public async deleteArtist(artistId: string): Promise<void> {
		const className = ArtistsDAO.name;
		const functionName = this.deleteArtist.name;
		try {
			return await KnexClient.mysqlClient<ArtistInterface>(tableName).where('artistId', artistId).del();
		} catch (error) {
			logger.error({ className, functionName, message: 'Error deleting artist', error });
			throw new AppError('Error deleting artist', 500, error);
		}
	}

	public async getAllArtists(
		filters: { grammy?: number; hidden?: boolean } = {},
		includedFields: (keyof ArtistInterface)[] | null = null,
		excludedFields: (keyof ArtistInterface)[] | null = null,
		limit: number | null = 5,
		offset: number | null = 5,
	) {
		const className = ArtistsDAO.name;
		const functionName = this.getAllArtists.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);
			let query = KnexClient.mysqlClient<ArtistInterface>(tableName).select(selectFields).orderBy('createdDate', 'asc');

			if (filters.grammy !== undefined) {
				query = query.where('grammy', filters.grammy);
			}
			if (filters.hidden !== undefined) {
				query = query.where('hidden', filters.hidden);
			}
			if (limit !== null) {
				query = query.limit(limit);
			}
			if (offset !== null) {
				query = query.offset(offset);
			}

			const artists = await query;
			return artists;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error fetching all artists', error });
			throw new AppError('Error fetching all artists', 500, error);
		}
	}
}

export { ArtistsDAO, ArtistInterface };
