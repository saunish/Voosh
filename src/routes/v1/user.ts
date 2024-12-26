import { UserController } from '../../controllers/index.js';
import { authValidatorInstance, requestValidatorInstance } from '../../utils/index.js';
import Joi from 'joi';

const userController = new UserController();

const routeConfig = [
	{
		path: 'signup',
		method: 'post',
		middlewares: [
			requestValidatorInstance.validate(
				Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required(),
				}).required(),
			),
		],
		controller: userController.signup,
	},
	{
		path: 'login',
		method: 'post',
		middlewares: [
			requestValidatorInstance.validate(
				Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required(),
				}).required(),
			),
		],
		controller: userController.signin,
	},
	{
		path: 'secure',
		method: 'post',
		middlewares: [authValidatorInstance.validate()],
		controller: userController.secure,
	},
];

export { routeConfig };
