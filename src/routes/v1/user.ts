import { UserController } from '../../controllers/index.js';
import { requestValidatorInstance } from '../../utils/index.js';
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
