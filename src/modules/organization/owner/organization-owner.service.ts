import { Injectable } from '@nestjs/common';
import { organizations } from '../../../database/schema/organizations';
import { and, eq } from 'drizzle-orm';
import { DBService } from '../../../common/db.service';
import { members } from '../../../database/schema/members/members';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BcryptUtils } from '../../../common/utils/bcrypt.utils';

@Injectable()
export class OrganizationOwnerService extends DBService {
	findAllAdmins(id: number) {
		return this.db.query.members.findMany({
			where: and(eq(members.organizationID, id), eq(members.role, 'admin'))
		});
	}

	async createAdmin(createAdminDto: CreateAdminDto, id: number) {
		await this.db.insert(members).values({
			organizationID: id,
			role: 'admin',
			name: createAdminDto.displayName,
			username: createAdminDto.username,
			password: await BcryptUtils.hashPassword(createAdminDto.password)
		});
	}

	async deleteAdmin(id: number, organizationID: number) {
		await this.db
			.delete(members)
			.where(
				and(eq(members.id, id), eq(members.organizationID, organizationID))
			);
	}

	async delete(id: number) {
		await this.db.delete(organizations).where(eq(organizations.id, id));

		// TODO: Delete all sessions related to the recently deleted organization
	}
}
