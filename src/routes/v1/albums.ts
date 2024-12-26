import Joi from 'joi';
import { AlbumsController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';

const albumsController = new AlbumsController();

const routeConfig = [
	{
		path: 'getAll',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Album')],
		controller: albumsController.getAllAlbums,
	},
	{
		path: ':albumId',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Album')],
		controller: albumsController.getAlbum,
	},
	{
		path: 'add-album',
		method: 'post',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('manage', 'Album'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string().required(),
					year: Joi.number().required(),
					artistId: Joi.string().required(),
					hidden: Joi.boolean().required(),
				}).required(),
			),
		],
		controller: albumsController.addAlbum,
	},
	{
		path: ':albumId',
		method: 'delete',
		middlewares: [authValidatorInstance.validate(), checkAbility('manage', 'Album')],
		controller: albumsController.deleteAlbum,
	},
	{
		path: ':albumId',
		method: 'put',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('update', 'Album'),
			requestValidatorInstance.validate(
				Joi.object({
					name: Joi.string().required(),
					year: Joi.number().required(),
					hidden: Joi.boolean().required(),
				}).required(),
			),
		],
		controller: albumsController.updateAlbumDetails,
	},
];

export { routeConfig };
