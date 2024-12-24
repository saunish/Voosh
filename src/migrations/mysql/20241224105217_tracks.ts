import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tracks', (table) => {
		table.bigIncrements('track_id').primary();
		table.uuid('trackId').notNullable().defaultTo(knex.raw('(uuid())'));
		table.string('name').notNullable().index();
		table.integer('duration').notNullable();
		table.boolean('hidden').defaultTo(false);
		table.bigInteger('album_id').notNullable().references('albums.album_id').unsigned().onDelete('CASCADE');
		table.bigInteger('artist_id').notNullable().references('artists.artist_id').unsigned().onDelete('CASCADE');
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('tracks');
}
