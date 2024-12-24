const messageCodeConfig = {
	SUCCESS: {
		status: 200,
		success: true,
		message: 'Success',
		messageCode: 'VFPL-CORE-2000',
	},
	VALIDATION_ERROR: {
		status: 400,
		success: false,
		message: 'Validation error',
		messageCode: 'VFPL-CORE-4000',
	},
	NO_DATA_FOUND: {
		status: 400,
		success: false,
		message: 'No data found with given parameters',
		messageCode: 'VFPL-CORE-4001',
	},
	CREATE_ERROR: {
		status: 400,
		success: false,
		message: 'Create unsuccessful',
		messageCode: 'VFPL-CORE-4002',
	},
	NOT_FOUND: {
		status: 404,
		success: false,
		message: 'Not found',
		messageCode: 'VFPL-CORE-4004',
	},
	UNAUTHORIZED: {
		status: 401,
		success: false,
		message: 'Unauthorized access',
		messageCode: 'VFPL-CORE-4005',
	},
	INTERNAL_SERVER_ERROR: {
		status: 500,
		success: false,
		message: 'Internal server error',
		messageCode: 'VFPL-CORE-5000',
	},
};

export { messageCodeConfig };
