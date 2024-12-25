import { Request, Response, NextFunction, Application, ErrorRequestHandler } from 'express';
import { createHttpResponse, logger } from '../utils/index.js';

interface HttpError extends Error {
	status: number;
	data?: unknown;
	message: string;
	error?: unknown;
}

class ErrorHandler {
	private notFound = (_req: Request, _res: Response, next: NextFunction): void => {
		const error = createHttpResponse({ status: 404, message: 'Not Found' });
		next(error);
	};

	private errorHandler = (httpError: HttpError, _req: Request, res: Response, _next: NextFunction): Response => {
		const className = ErrorHandler.name;
		const functionName = this.errorHandler.name;
		try {
			const { status, data, message, error } = httpError;
			if (status && message) {
				return res.status(status).json({ status, data, message, error });
			} else {
				logger.error({ functionName, message: 'unknown error found', className, error: httpError });
				return res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: null });
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'errorHandler catch error =>', error, className });
			return res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: null });
		}
	};

	public init = (app: Application): void => {
		app.use(this.notFound);
		app.use(this.errorHandler as unknown as ErrorRequestHandler);
	};
}

export { ErrorHandler };
