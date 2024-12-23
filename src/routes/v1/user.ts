import { UserController } from '../../controllers/index.js';
import { requestValidatorInstance } from '../../utils/index.js';
import Joi from 'joi';

const routeConfig = [
	{
		path: 'signup',
		method: 'post',
		middlewares: [
			requestValidatorInstance.validate(
				Joi.object({
					username: Joi.string().required(),
					emailId: Joi.string().email().required(),
					mobile: Joi.string().required(),
					firstName: Joi.string().required(),
					lastName: Joi.string().required(),
					roleId: Joi.number().required(),
					password: Joi.string().required(),
				}).required(),
			),
		],
		controller: UserController.signup,
	},
	{
		path: 'signin',
		method: 'post',
		middlewares: [
			requestValidatorInstance.validate(
				Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required(),
				}).required(),
			),
		],
		controller: UserController.signin,
	},
];

export { routeConfig };
