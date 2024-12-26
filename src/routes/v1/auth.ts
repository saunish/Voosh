import { AuthController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';
import Joi from 'joi';

const authController = new AuthController();

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
		controller: authController.signup,
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
		controller: authController.signin,
	},
	{
		path: 'logout',
		method: 'get',
		middlewares: [authValidatorInstance.validate()],
		controller: authController.logout,
	},
];

export { routeConfig };
