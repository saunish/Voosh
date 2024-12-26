import { hasValue } from './helpers.js';

interface CreateHttpResponseInterface {
	status: number;
	message: string;
	data?: unknown;
	error?: unknown;
}

const createHttpResponse = (httpResponseObject: CreateHttpResponseInterface) => {
	const {
		status,
		message,
		data = hasValue(httpResponseObject.data) ? httpResponseObject.data : null,
		error = hasValue(httpResponseObject.error) ? httpResponseObject.error : null,
	} = httpResponseObject;
	return { status, message, data, error };
};

export { createHttpResponse };
