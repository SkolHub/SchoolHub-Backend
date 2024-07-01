import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DBService } from '../../common/db.service';
import { eq } from 'drizzle-orm';
import { members } from '../../database/schema/members/members';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';

@Injectable()
export class ProfileService extends DBService {
	account(userID: number) {
		return this.db.query.members.findFirst({
			where: eq(members.id, userID),
			with: {
				organization: {
					columns: {
						name: true
					}
				}
			},
			columns: {
				name: true,
				role: true,
				username: true
			}
		});
	}

	async changePassword(changePasswordDto: ChangePasswordDto, userID: number) {
		await this.db
			.update(members)
			.set({
				password: await BcryptUtils.hashPassword(changePasswordDto.password)
			})
			.where(eq(members.id, userID));
	}
}
