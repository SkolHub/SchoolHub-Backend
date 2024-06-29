import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { members } from '../../database/schema/members/members';
import { Database } from '../../types/database';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';

@Injectable()
export class AuthService {
	constructor(@Inject('DB') private readonly db: Database) {}

	async validateGlobalUser(email: string, password: string) {
		const user = await this.db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (user && (await BcryptUtils.comparePasswords(password, user.password))) {
			return {
				id: user.id
			};
		}

		return null;
	}

	async validateOrganizationUser(username: string, password: string) {
		const user = await this.db.query.members.findFirst({
			where: eq(members.username, username)
		});

		if (user && (await BcryptUtils.comparePasswords(password, user.password))) {
			return {
				userID: user.id,
				organizationID: user.organizationID,
				role: user.role
			};
		}
	}

	async create(createAuthDto: AuthDto) {
		try {
			await this.db.insert(users).values({
				password: await BcryptUtils.hashPassword(createAuthDto.password),
				email: createAuthDto.email
			});
		} catch (e) {
			if (e.code === '23505') {
				throw new ConflictException('Email already exists');
			}
		}
	}
}
