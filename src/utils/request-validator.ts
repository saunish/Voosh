import { Request, Response, NextFunction, RequestHandler } from 'express';
import { messageCodeConfig } from '../configs/index.js';
import { createHttpError, logger } from './index.js';
import Joi from 'joi';

class RequestValidator {
	public validate = (schema: Joi.Schema): RequestHandler => {
		const className = RequestValidator.name;
		const functionName = this.validate.name;

		return (req: Request, _res: Response, next: NextFunction): void => {
			const bodyValidation = schema.validate(req.body, { abortEarly: false });
			if (bodyValidation.error) {
				const error = bodyValidation.error?.details;
				const errorMessage = error?.map((err: unknown & { message: string }) => err.message);
				const httpValidationError = createHttpError({ ...messageCodeConfig.VALIDATION_ERROR, body: errorMessage });
				logger.error({ functionName, message: 'Error in request validator', className, error });
				return next(httpValidationError);
			} else return next();
		};
	};
}

const requestValidatorInstance = new RequestValidator();
export { requestValidatorInstance };
