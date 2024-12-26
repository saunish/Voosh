import Joi from 'joi';
import { ArtistsController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';

const artistsController = new ArtistsController();

const routeConfig = [
	{
		path: 'getAll',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Artist')],
		controller: artistsController.getAllArtists,
	},
	{
		path: 'add-artist',
		method: 'post',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('manage', 'Artist'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string().required(),
					grammy: Joi.number().required(),
					hidden: Joi.boolean().required(),
				}).required(),
			),
		],
		controller: artistsController.addArtist,
	},
	{
		path: ':artistId',
		method: 'delete',
		middlewares: [authValidatorInstance.validate(), checkAbility('manage', 'Artist')],
		controller: artistsController.deleteArtist,
	},
	{
		path: ':artistId',
		method: 'put',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('update', 'Artist'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string().required(),
					grammy: Joi.number().required(),
					hidden: Joi.boolean().required(),
				}).required(),
			),
		],
		controller: artistsController.updateArtistDetails,
	},
];

export { routeConfig };
