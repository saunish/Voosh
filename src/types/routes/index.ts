import { Router, RequestHandler } from 'express';

export interface RouteConfig {
	path: string;
	method: 'get' | 'post' | 'put' | 'delete';
	middlewares?: RequestHandler[];
	controller: Router;
}
