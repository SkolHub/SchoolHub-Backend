import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { DBService } from '../../common/db.service';
import { members } from '../../database/schema/members';
import { parents } from '../../database/schema/parents';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends DBService {
	constructor(private readonly jwtService: JwtService) {
		super();
	}

	async validateUser(
		user: string,
		password: string
	): Promise<{
		token: string;
	}> {
		const member = await this.db.query.members.findFirst({
			where: eq(members.user, user),
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
				token: this.jwtService.sign({
					userID: member.id,
					organizationID: member.organizationID,
					role: member.role,
					studentID:
						member.role === 'parent'
							? (
									await this.db.query.parents.findFirst({
										where: eq(parents.memberID, member.id),
										columns: {
											studentID: true
										}
									})
								).studentID
							: undefined
				})
			};
		}

		return null;
	}
}
