import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { UsersDAO } from '../data-access-layer/mysql/users.js';
import { hasValue, safePromise } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';
import { createHttpResponse } from '../utils/create-http-response.js';

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
				},
				async (jwtPayload: { userId: string }, done: VerifiedCallback) => {
					try {
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
