import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('artists', (table) => {
		table.uuid('artistId').notNullable().defaultTo(knex.raw('(uuid())')).primary();
		table.string('name').notNullable().index();
		table.boolean('grammy').defaultTo(false);
		table.boolean('hidden').defaultTo(false);
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('artists');
}
