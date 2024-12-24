import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (table) => {
		table.binary('userId', 16).primary();
		table.string('email', 320).notNullable().unique();
		table.string('password', 128).notNullable();
		table.enum('role', ['admin', 'editor', 'viewer']).notNullable();
		table.binary('parentId', 16).nullable();
		table.timestamp('createdDate').defaultTo(knex.fn.now());
		table.timestamp('updatedDate').nullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
		table.foreign('parentId').references('users.userId').onDelete('CASCADE');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('users');
}
