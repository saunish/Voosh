import { Application } from 'express';
import { join } from 'path';
import { readdir } from 'fs/promises';
import { ErrorHandler } from './error-handler.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { RouteConfig } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Route {
	private static errorHandler = new ErrorHandler();

	public static load = async (app: Application): Promise<void> => {
		const direntList = await readdir(join(__dirname), { withFileTypes: true });
		const directoryList = direntList.filter((dirent) => dirent.isDirectory());
		await Promise.all(
			directoryList.map(async (directory) => {
				const routeFiles = await readdir(join(__dirname, directory.name));
				await Promise.all(
					routeFiles.map(async (routeFile) => {
						const routePath = join(__dirname, directory.name, routeFile);
						const routeName = routeFile.split('.')[0];
						const { routeConfig } = await import(routePath);
						routeConfig.forEach((config: RouteConfig) => {
							app[config.method](`/api/${directory.name}/${routeName}/${config.path}`, config.middlewares || [], config.controller);
						});
					}),
				);
			}),
		);
		this.errorHandler.init(app);
	};
}

export { Route };
