import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('favorites', (table) => {
		table.dropColumn('favorite_id');
		table.uuid('favoriteId').notNullable().defaultTo(knex.raw('(uuid())')).primary().alter();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('favorites', (table) => {
		table.dropPrimary();
		table.bigIncrements('favorite_id').primary();
		table.uuid('favoriteId').alter();
	});
}
