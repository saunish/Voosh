import httpError from 'http-errors';

interface createHttpErrorInterface {
	status: number;
	success: boolean;
	message: string;
	messageCode: string;
	body?: unknown;
	expose?: boolean;
}

const createHttpError = (httpErrorObject: createHttpErrorInterface) => {
	const expose = process.env.NODE_ENV !== 'production';
	const { status, message, messageCode, success, body } = httpErrorObject;
	const error = httpError(status, message, { messageCode, success, body, expose });
	return error;
};

export { createHttpError };
