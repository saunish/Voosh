import jwt from 'jsonwebtoken';

export const generateToken = (payload: string | object | Buffer): string => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: process.env.JWT_EXPIRY || '1d',
	});
};
