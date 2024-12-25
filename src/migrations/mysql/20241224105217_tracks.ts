import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tracks', (table) => {
		table.uuid('trackId').notNullable().defaultTo(knex.raw('(uuid())')).primary();
		table.string('name').notNullable().index();
		table.integer('duration').notNullable();
		table.boolean('hidden').defaultTo(false);
		table.uuid('albumId').notNullable().references('albums.albumId').onDelete('CASCADE');
		table.uuid('artistId').notNullable().references('artists.artistId').onDelete('CASCADE');
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('tracks');
}
