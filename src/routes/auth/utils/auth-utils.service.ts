import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthUtilsService {
	private readonly salt_rounds = 10;

	constructor() {}

	async hashPassword(password: string): Promise<string> {
		const salt = await genSalt(this.salt_rounds);

		return await hash(password, salt);
	}

	async comparePasswords(incoming: string, original: string): Promise<boolean> {
		return compare(incoming, original);
	}
}
