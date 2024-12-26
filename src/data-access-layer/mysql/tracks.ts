import { KnexClient } from '../../boot/knex.js';
import { AppError, getSelectFields, logger } from '../../utils/index.js';

const tableName = 'tracks';

const TrackSchema = {
	trackId: 'string',
	albumId: 'string',
	artistId: 'string',
	name: 'string',
	duration: 'integer',
	hidden: 'boolean',
	createdDate: 'Date',
	updatedDate: 'Date',
} as const;

const ALL_FIELDS = Object.keys(TrackSchema) as (keyof typeof TrackSchema)[];

type TrackInterface = {
	[K in keyof typeof TrackSchema]: K extends 'createdDate' | 'updatedDate' ? Date : K extends 'hidden' ? boolean : K extends 'duration' ? number : string;
};

class TracksDAO {
	private readonly defaultExcludedFields: (keyof TrackInterface)[] = [];

	public async createTrack(trackData: TrackInterface): Promise<string | void> {
		const className = TracksDAO.name;
		const functionName = this.createTrack.name;
		try {
			await KnexClient.mysqlClient<TrackInterface>(tableName).insert({
				trackId: trackData.trackId,
				albumId: trackData.albumId,
				artistId: trackData.artistId,
				name: trackData.name,
				duration: trackData.duration,
				hidden: trackData.hidden,
				createdDate: new Date(),
				updatedDate: new Date(),
			});

			return 'insert successful';
		} catch (error) {
			logger.error({ className, functionName, message: 'Error creating track', error });
			throw new AppError('Error creating track', 500, error);
		}
	}

	public async getTrackById(
		trackId: string,
		includedFields: (keyof TrackInterface)[] | null = null,
		excludedFields: (keyof TrackInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<TrackInterface>> {
		const className = TracksDAO.name;
		const functionName = this.getTrackById.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const track: TrackInterface = (await KnexClient.mysqlClient<TrackInterface>(tableName).select(selectFields).where({ trackId }).first()) as unknown as TrackInterface;
			return track;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting track by ID', error });
			throw new AppError('Error getting track by ID', 500, error);
		}
	}

	public async getTracksByAlbumId(
		albumId: string,
		includedFields: (keyof TrackInterface)[] | null = null,
		excludedFields: (keyof TrackInterface)[] | null = null,
		ignoreExcludedFields = false,
	): Promise<Partial<TrackInterface>[]> {
		const className = TracksDAO.name;
		const functionName = this.getTracksByAlbumId.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, ignoreExcludedFields ? [] : this.defaultExcludedFields, includedFields, excludedFields);
			const tracks = (await KnexClient.mysqlClient<TrackInterface>(tableName).select(selectFields).where({ albumId })) as unknown as TrackInterface[];
			return tracks;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error getting tracks by album ID', error });
			throw new AppError('Error getting tracks by album ID', 500, error);
		}
	}

	public async updateTrackById(trackUpdateDetails: Partial<TrackInterface>, trackId: string): Promise<Partial<TrackInterface>> {
		const className = TracksDAO.name;
		const functionName = this.updateTrackById.name;
		try {
			await KnexClient.mysqlClient<TrackInterface>(tableName).where('trackId', trackId).update(trackUpdateDetails);
			const updatedTrack = await this.getTrackById(trackId);
			return updatedTrack;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error updating track by ID', error });
			throw new AppError('Error updating track by ID', 500, error);
		}
	}

	public async deleteTrack(trackId: string): Promise<void> {
		const className = TracksDAO.name;
		const functionName = this.deleteTrack.name;
		try {
			return await KnexClient.mysqlClient<TrackInterface>(tableName).where('trackId', trackId).del();
		} catch (error) {
			logger.error({ className, functionName, message: 'Error deleting track', error });
			throw new AppError('Error deleting track', 500, error);
		}
	}

	public async getAllTracks(
		filters: { albumId?: string; artistId?: string; hidden?: boolean } = {},
		includedFields: (keyof TrackInterface)[] | null = null,
		excludedFields: (keyof TrackInterface)[] | null = null,
		limit: number | null = 5,
		offset: number | null = 0,
	): Promise<Partial<TrackInterface>[]> {
		const className = TracksDAO.name;
		const functionName = this.getAllTracks.name;
		try {
			const selectFields: string[] = getSelectFields(ALL_FIELDS, this.defaultExcludedFields, includedFields, excludedFields);
			let query = KnexClient.mysqlClient<TrackInterface>(tableName).select(selectFields).orderBy('createdDate', 'asc');

			if (filters.albumId !== undefined) {
				query = query.where('albumId', filters.albumId);
			}
			if (filters.artistId !== undefined) {
				query = query.where('artistId', filters.artistId);
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

			const tracks: TrackInterface[] = (await query) as unknown as TrackInterface[];
			return tracks;
		} catch (error) {
			logger.error({ className, functionName, message: 'Error fetching all tracks', error });
			throw new AppError('Error fetching all tracks', 500, error);
		}
	}
}

export { TracksDAO, TrackInterface };
