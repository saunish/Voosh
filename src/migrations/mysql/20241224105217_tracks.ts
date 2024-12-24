import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tracks', (table) => {
		table.binary('trackId', 16).primary();
		table.string('name').notNullable().index();
		table.integer('duration').notNullable();
		table.boolean('hidden').defaultTo(false);
		table.binary('albumId', 16).notNullable().references('albums.albumId').onDelete('CASCADE');
		table.binary('artistId', 16).notNullable().references('artists.artistId').onDelete('CASCADE');
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('tracks');
}
