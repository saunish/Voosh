import { KnexClient } from '../boot/knex.js';

class Helpers {
	public static async selectAllExcept(tableName: string, excludeFields: string[]) {
		const columns = await KnexClient.mysqlClient(tableName).columnInfo();
		const selectedColumns = Object.keys(columns).filter((col) => !excludeFields.includes(col));
		return selectedColumns;
	}
}

export { Helpers };
