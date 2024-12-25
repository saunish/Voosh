import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('favorites', (table) => {
		table.bigIncrements('favorite_id').primary();
		table.uuid('favoriteId').notNullable().defaultTo(knex.raw('(uuid())'));
		table.uuid('userId').notNullable().references('users.userId').onDelete('CASCADE');
		table.enum('category', ['album', 'artist', 'track']).notNullable();
		table.uuid('itemId').notNullable();
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('tracks');
}
