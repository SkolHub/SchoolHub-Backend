import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { members } from '../../database/schema/members/members';
import { MemberSession } from '../../types/session';
import { DBService } from '../../common/db.service';

@Injectable()
export class AuthService extends DBService {
	async validateUser(
		username: string,
		password: string
	): Promise<MemberSession> {
		const member = await this.db.query.members.findFirst({
			where: eq(members.username, username),
			columns: {
				password: true,
				id: true,
				organizationID: true,
				role: true
			}
		});

		if (
			member &&
			(await BcryptUtils.comparePasswords(password, member.password))
		) {
			return {
				userID: member.id,
				organizationID: member.organizationID,
				role: member.role
			};
		}

		return null;
	}

	// async create(createAuthDto: AuthDto) {
	// 	try {
	// 		await this.db.insert(users).values({
	// 			password: await BcryptUtils.hashPassword(createAuthDto.password),
	// 			email: createAuthDto.email
	// 		});
	// 	} catch (e) {
	// 		if (e.code === '23505') {
	// 			throw new ConflictException('Email already exists');
	// 		}
	// 	}
	// }
}
