import { createLogger, format, transports } from 'winston';
import { assign } from 'lodash-es';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const level = () => {
	const env = process.env.NODE_ENV || 'development';
	const isDevelopment = env === 'development';
	return isDevelopment ? 'debug' : 'warn';
};

const enumerateErrorFormat = format((info) => {
	if (info.error instanceof Error) {
		info.error = assign(
			{
				message: info.error.message,
				stack: info.error.stack,
			},
			info.error,
		);
	}
	return info;
});

const customFormat = format.printf((info) => {
	let msg = `${info.timestamp} [${info.level}]:`;
	if (info.className) msg += ` [className: ${info.className}]`;
	if (info.functionName) msg += ` [functionName: ${info.functionName}]`;
	if (info.message) msg += ` [message: ${info.message}]`;
	if (info.error) msg += ` [error: ${JSON.stringify(info.error)}]`;
	if (info.warnObject) msg += ` [warn: ${JSON.stringify(info.warnObject)}]`;
	if (info.result) msg += ` [result: ${JSON.stringify(info.result)}]`;
	if (info.debugObject) msg += ` [debug: ${JSON.stringify(info.debugObject)}]`;
	return msg;
});

const winstonFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	format.colorize(),
	format.errors({ stack: true }),
	enumerateErrorFormat(),
	customFormat,
);

const winstonTransports = [new transports.Console()];

const winstonLogger = createLogger({
	level: level(),
	levels,
	format: winstonFormat,
	transports: winstonTransports,
});

interface loggerInterface {
	functionName: string;
	message: string;
	className?: string;
	error?: unknown;
	warnObject?: unknown;
	result?: unknown;
	debugObject?: unknown;
}

const logger = {
	error: (loggerObject: loggerInterface) => winstonLogger.log('error', loggerObject),
	warn: (loggerObject: loggerInterface) => winstonLogger.log('warn', loggerObject),
	info: (loggerObject: loggerInterface) => winstonLogger.log('info', loggerObject),
	debug: (loggerObject: loggerInterface) => winstonLogger.log('debug', loggerObject),
	http: (message: string) => winstonLogger.log('http', message),
};

export { logger };
