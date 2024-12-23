import { createServer } from 'http';
import figlet from 'figlet';
import { Server } from './server.js';
import { logger } from '../utils/index.js';

class Boot {
	public static startServer = async (): Promise<void> => {
		const className = Boot.name;
		const functionName = this.startServer.name;
		try {
			const normalizePort = (val: string | number) => {
				const port = typeof val === 'string' ? parseInt(val, 10) : val;
				if (Number.isNaN(port)) return val;
				if (port >= 0) return port;
				return false;
			};

			const app = await Server.init();
			const server = createServer(app);

			const port = normalizePort(process.env.PORT || '3000');
			app.set('port', port);

			const onError = (error: NodeJS.ErrnoException) => {
				if (error.syscall !== 'listen') throw error;

				const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

				switch (error.code) {
					case 'EACCES':
						logger.error({ functionName, message: `${bind} requires elevated privileges`, className, error });
						process.exit(1);
						break;
					case 'EADDRINUSE':
						logger.error({ functionName, message: `${bind} is already in use`, className, error });
						process.exit(1);
						break;
					default:
						throw error;
				}
			};

			const onListening = () => {
				const addr = server.address();
				if (addr !== null) {
					const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
					logger.info({ functionName, message: 'server started successfully', className });
					logger.info({ functionName, message: `Listening on ${bind}`, className });
					console.log(figlet.textSync('VOOSH'));
				} else {
					logger.error({ functionName, message: 'Address is null', className });
					process.exit(1);
				}
			};

			server.listen(port);
			server.on('error', onError);
			server.on('listening', onListening);
		} catch (error: unknown) {
			logger.error({ functionName, message: 'Error while starting server', className, error });
			process.exit(1);
		}
	};
}

export { Boot };
