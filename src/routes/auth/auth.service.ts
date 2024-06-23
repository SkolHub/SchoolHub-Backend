import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Database } from '../../core/types';
import { users } from '../../schema/users';
import { eq } from 'drizzle-orm';
import { AuthUtilsService } from './utils/auth-utils.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject('DB') private readonly db: Database,
		private readonly authUtils: AuthUtilsService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (
			user &&
			(await this.authUtils.comparePasswords(password, user.password))
		) {
			return {
				id: user.id
			};
		}

		return null;
	}

	async create(createAuthDto: AuthDto) {
		try {
			await this.db.insert(users).values({
				password: await this.authUtils.hashPassword(createAuthDto.password),
				email: createAuthDto.email
			});
		} catch (e) {
			if (e.code === '23505') {
				throw new ConflictException('Email already exists');
			}
		}
	}
}
