import morgan from 'morgan';
import { logger } from './logger.js';

const stream: morgan.StreamOptions = {
	write: (message) => logger.http(message),
};

const skip = () => {
	const env = process.env.NODE_ENV || 'development';
	return env !== 'development';
};

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms', { stream, skip });

export { morganLogger };
