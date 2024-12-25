interface CreateHttpResponseInterface {
	status: number;
	message: string;
	data?: unknown;
	error?: unknown;
}

const createHttpResponse = (httpResponseObject: CreateHttpResponseInterface) => {
	const { status, message, data = null, error = null } = httpResponseObject;
	return { status, message, data, error };
};

export { createHttpResponse };
