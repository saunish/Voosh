import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('albums', (table) => {
		table.uuid('albumId').notNullable().defaultTo(knex.raw('(uuid())')).primary();
		table.uuid('artistId').notNullable().references('artists.artistId').onDelete('CASCADE');
		table.string('name').notNullable().index();
		table.integer('year').notNullable();
		table.boolean('hidden').defaultTo(false);
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('albums');
}
