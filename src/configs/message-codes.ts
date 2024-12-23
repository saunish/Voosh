const messageCodeConfig = {
	SUCCESS: {
		status: 200,
		success: true,
		message: 'Success',
		messageCode: 'ERP-CORE-2000',
	},
	VALIDATION_ERROR: {
		status: 400,
		success: false,
		message: 'Validation error',
		messageCode: 'ERP-CORE-4000',
	},
	NO_DATA_FOUND: {
		status: 400,
		success: false,
		message: 'No data found with given parameters',
		messageCode: 'ERP-CORE-4001',
	},
	CREATE_ERROR: {
		status: 400,
		success: false,
		message: 'Create unsuccessful',
		messageCode: 'ERP-CORE-4002',
	},
	ALREADY_EXIST: {
		status: 400,
		success: false,
		message: 'Already exist',
		messageCode: 'ERP-CORE-4003',
	},
	NOT_FOUND: {
		status: 404,
		success: false,
		message: 'Not found',
		messageCode: 'ERP-CORE-4004',
	},
	UNAUTHORIZED: {
		status: 401,
		success: false,
		message: 'Unauthorized access',
		messageCode: 'ERP-CORE-4005',
	},
	INVALID_TOKEN: {
		status: 401,
		success: false,
		message: 'Invalid token',
		messageCode: 'ERP-CORE-4006',
	},
	TOKEN_EXPIRED: {
		status: 401,
		success: false,
		message: 'Token expired',
		messageCode: 'ERP-CORE-4007',
	},
	INVALID_PASSWORD: {
		status: 401,
		success: false,
		message: 'Invalid password',
		messageCode: 'ERP-CORE-4008',
	},
	// server side errors
	INTERNAL_SERVER_ERROR: {
		status: 500,
		success: false,
		message: 'Internal server error',
		messageCode: 'ERP-CORE-5000',
	},
};

export { messageCodeConfig };
