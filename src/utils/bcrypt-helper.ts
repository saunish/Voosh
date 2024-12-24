import bcryptjs from 'bcryptjs';

class BcryptHelper {
	static async hashPassword(password: string): Promise<string> {
		const salt = await bcryptjs.genSalt(Number(process.env.HASH_SALT_ROUNDS) || 10);
		return bcryptjs.hash(password, salt);
	}

	static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		return bcryptjs.compare(password, hashedPassword);
	}
}

export { BcryptHelper };
