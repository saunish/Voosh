import Joi from 'joi';
import { TracksController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';

const tracksController = new TracksController();

const routeConfig = [
	{
		path: 'getAll',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Track')],
		controller: tracksController.getAllTracks,
	},
	{
		path: ':trackId',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Track')],
		controller: tracksController.getTrack,
	},
	{
		path: 'add-track',
		method: 'post',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('manage', 'Track'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string().required(),
					duration: Joi.number().required(),
					albumId: Joi.string().required(),
					artistId: Joi.string().required(),
					hidden: Joi.boolean().required(),
				}).required(),
			),
		],
		controller: tracksController.addTrack,
	},
	{
		path: ':trackId',
		method: 'delete',
		middlewares: [authValidatorInstance.validate(), checkAbility('manage', 'Track')],
		controller: tracksController.deleteTrack,
	},
	{
		path: ':trackId',
		method: 'put',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('update', 'Track'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string(),
					duration: Joi.number(),
					hidden: Joi.boolean(),
				}).required(),
			),
		],
		controller: tracksController.updateTrackDetails,
	},
];

export { routeConfig };
