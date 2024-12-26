import Joi from 'joi';
import { FavoritesController } from '../../controllers/index.js';
import { authValidatorInstance, checkAbility, requestValidatorInstance } from '../../utils/index.js';

const favoritesController = new FavoritesController();

const routeConfig = [
	{
		path: ':category',
		method: 'get',
		middlewares: [authValidatorInstance.validate(), checkAbility('read', 'Favorite')],
		controller: favoritesController.getFavorites,
	},
	{
		path: 'add-favorite',
		method: 'post',
		middlewares: [
			authValidatorInstance.validate(),
			checkAbility('manage', 'Favorite'),
			requestValidatorInstance.validate(
				Joi.object({
					category: Joi.string().valid('artist', 'album', 'track').required(),
					itemId: Joi.string().uuid().required(),
				}).required(),
			),
		],
		controller: favoritesController.addFavorite,
	},
	{
		path: ':id',
		method: 'delete',
		middlewares: [authValidatorInstance.validate(), checkAbility('manage', 'Favorite')],
		controller: favoritesController.removeFavorite,
	},
];

export { routeConfig };
