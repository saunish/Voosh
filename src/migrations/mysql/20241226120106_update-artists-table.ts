import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('artists', (table) => {
		table.integer('grammy').alter();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('artists', (table) => {
		table.boolean('grammy').defaultTo(false).alter();
	});
}
