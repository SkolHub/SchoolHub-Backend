import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq } from 'drizzle-orm';
import { members } from '../../../database/schema/members/members';
import { BcryptUtils } from '../../../common/utils/bcrypt.utils';
import { AddAdminDto } from './dto/add-admin.dto';

@Injectable()
export class AccountsAdminService extends DBService {
	async create(createAdminDto: AddAdminDto, organizationID: number) {
		await this.db.insert(members).values({
			organizationID,
			role: 'admin',
			name: createAdminDto.displayName,
			username: createAdminDto.username,
			password: await BcryptUtils.hashPassword(createAdminDto.password)
		});
	}

	findAll(organizationID: number) {
		return this.db.query.members.findMany({
			where: and(
				eq(members.organizationID, organizationID),
				eq(members.role, 'admin')
			)
		});
	}

	async remove(id: number, organizationID: number, ownerID: number) {
		if (id === ownerID) {
			throw new ForbiddenException("Owner account can't be deleted");
		}

		await this.db
			.delete(members)
			.where(
				and(eq(members.id, id), eq(members.organizationID, organizationID))
			);
	}
}
