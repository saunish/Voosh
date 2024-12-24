import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (table) => {
		table.bigIncrements('user_id').primary();
		table.uuid('userId').notNullable().defaultTo(knex.raw('(uuid())'));
		table.string('email', 320).notNullable().unique();
		table.string('password', 128).notNullable();
		table.enum('role', ['admin', 'editor', 'viewer']).notNullable();
		table.bigInteger('parent_id').unsigned().nullable();
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.foreign('parent_id').references('users.user_id').onDelete('CASCADE');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('users');
}
