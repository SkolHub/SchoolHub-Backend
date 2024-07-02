import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { members } from '../../../database/schema/members';
import { BcryptUtils } from '../../../common/utils/bcrypt.utils';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class AccountsAdminService extends DBService {
	async create(addAdminDto: AddAdminDto, organizationID: number) {
		await this.db.insert(members).values({
			user: addAdminDto.user,
			name: addAdminDto.name,
			password: await BcryptUtils.hashPassword(addAdminDto.password),
			role: 'admin',
			organizationID
		});
	}

	findAll(organizationID: number) {
		return this.db.query.members.findMany({
			where: and(
				eq(members.organizationID, organizationID),
				eq(members.role, 'admin')
			),
			columns: {
				id: true,
				user: true,
				name: true
			}
		});
	}

	async update(
		updateAdminDto: UpdateAdminDto,
		adminID: number,
		organizationID: number
	) {
		await this.db
			.update(members)
			.set({
				user: updateAdminDto.user,
				name: updateAdminDto.name
			})
			.where(
				and(eq(members.id, adminID), eq(members.organizationID, organizationID))
			);
	}

	async resetPassword(
		resetPasswordAdminDto: ResetPasswordAdminDto,
		adminID: number,
		organizationID: number
	) {
		await this.db
			.update(members)
			.set({
				password: await BcryptUtils.hashPassword(resetPasswordAdminDto.password)
			})
			.where(
				and(eq(members.id, adminID), eq(members.organizationID, organizationID))
			);
	}

	async remove(adminID: number, organizationID: number) {
		await this.db
			.delete(members)
			.where(
				and(eq(members.id, adminID), eq(members.organizationID, organizationID))
			);
	}
}
