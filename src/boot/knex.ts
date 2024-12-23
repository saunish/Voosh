import knex, { Knex } from 'knex';
import { knexConfig } from '../configs/index.js';

class KnexClient {
	public static mysqlClient: Knex;

	public static init = async (): Promise<void> => {
		KnexClient.mysqlClient = knex(knexConfig);
		await KnexClient.mysqlClient.raw('select 1+1 as result');
	};
}

export default () => knexConfig;

export { KnexClient };
