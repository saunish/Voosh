import { Request, Response, NextFunction, Application, ErrorRequestHandler } from 'express';
import { createHttpError, logger } from '../utils/index.js';
import { messageCodeConfig } from '../configs/index.js';

interface HttpError extends Error {
	status: number;
	message: string;
	messageCode?: string;
	success: boolean;
	body?: unknown;
	expose?: boolean;
}

class ErrorHandler {
	private notFound = (_req: Request, _res: Response, next: NextFunction): void => {
		const error = createHttpError(messageCodeConfig.NOT_FOUND);
		next(error);
	};

	private errorHandler = (httpError: HttpError, _req: Request, res: Response, _next: NextFunction): Response => {
		const className = ErrorHandler.name;
		const functionName = this.errorHandler.name;
		try {
			const { status, message, messageCode, success, body, expose } = httpError;
			if (status && message && success !== undefined) {
				return res.status(status).json({ status, success, message, messageCode, ...(expose ? { body } : null) });
			} else {
				logger.error({ functionName, message: 'unknown error found', className, error: httpError });
				return res.status(500).json(messageCodeConfig.INTERNAL_SERVER_ERROR);
			}
		} catch (error: unknown) {
			logger.error({ functionName, message: 'errorHandler catch error =>', error, className });
			return res.status(500).json(messageCodeConfig.INTERNAL_SERVER_ERROR);
		}
	};

	public init = (app: Application): void => {
		app.use(this.notFound);
		app.use(this.errorHandler as unknown as ErrorRequestHandler);
	};
}

export { ErrorHandler };
