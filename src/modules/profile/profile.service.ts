import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { members } from '../../database/schema/members';
import { eq } from 'drizzle-orm';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';

@Injectable()
export class ProfileService extends DBService {
	async getAccount(memberID: number) {
		return this.db.query.members.findFirst({
			where: eq(members.id, memberID),
			columns: {
				name: true,
				role: true
			},
			with: {
				organization: {
					columns: {
						name: true
					}
				}
			}
		});
	}

	async update(updatePasswordDto: UpdatePasswordDto, memberID: number) {
		await this.db
			.update(members)
			.set({
				password: await BcryptUtils.hashPassword(updatePasswordDto.password)
			})
			.where(eq(members.id, memberID));
	}
}
