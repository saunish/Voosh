import Joi from 'joi';
import { UsersController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';

const usersController = new UsersController();

const routeConfig = [
	{
		path: 'getAll',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'User')],
		controller: usersController.getAllUsers,
	},
	{
		path: 'add-user',
		method: 'post',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('manage', 'User'),
			requestValidatorInstance.validate(
				Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required(),
					role: Joi.string().valid('editor', 'viewer').required(),
				}).required(),
			),
		],
		controller: usersController.addUser,
	},
	{
		path: ':userId',
		method: 'delete',
		middlewares: [authValidatorInstance.validate(), checkAbility('manage', 'User')],
		controller: usersController.deleteUser,
	},
	{
		path: 'update-password',
		method: 'put',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('update', 'User'),
			requestValidatorInstance.validate(
				Joi.object({
					oldPassword: Joi.string().required(),
					newPassword: Joi.string().required(),
				}).required(),
			),
		],
		controller: usersController.updatePassword,
	},
];

export { routeConfig };
