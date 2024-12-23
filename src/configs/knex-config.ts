const knexConfig = {
	client: 'mysql2',
	connection: {
		host: process.env.MYSQL_HOST || 'localhost',
		port: Number(process.env.MYSQL_PORT) || 3306,
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD || '',
		database: process.env.MYSQL_DATABASE || '',
	},
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		directory: '../migrations/mysql',
		tableName: 'migrations',
		extension: 'ts',
	},
};

export { knexConfig };
