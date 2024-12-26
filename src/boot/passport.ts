import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { UsersDAO } from '../data-access-layer/mysql/users.js';
import { hasValue, safePromise } from '../utils/common-helpers.js';
import { logger } from '../utils/logger.js';
import { createHttpResponse } from '../utils/create-http-response.js';
import { AppAbility } from '../configs/casl-config.js';
import { getCache } from '../utils/redis-helper.js';

declare module 'express' {
	interface Request {
		ability?: AppAbility;
	}
}

class PassportLoader {
	private static userDAO = new UsersDAO();

	public static init() {
		const className = PassportLoader.name;
		const functionName = this.init.name;

		passport.use(
			'JwtStrategy',
			new JwtStrategy(
				{
					jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
					secretOrKey: process.env.JWT_SECRET || 'default_secret',
					passReqToCallback: true,
				},
				async (req, jwtPayload: { userId: string }, done: VerifiedCallback) => {
					try {
						const checkTokenValidity = await getCache(req.header('authorization')?.replace('Bearer ', '') as string);
						if (JSON.parse(checkTokenValidity as string) === 'blacklisted') {
							return done(null, false, createHttpResponse({ status: 401, message: 'Unauthorized' }));
						}
						const [userError, user] = await safePromise(this.userDAO.getUserById(jwtPayload.userId, null, null, true));
						if (userError) {
							return done(userError);
						} else if (hasValue(user)) {
							return done(null, user);
						} else {
							return done(null, false, createHttpResponse({ status: 401, message: 'Unauthorized' }));
						}
					} catch (error: unknown) {
						logger.error({ functionName, message: 'Catch error', error, className });
						return done(error);
					}
				},
			),
		);
	}
}

export { PassportLoader };
