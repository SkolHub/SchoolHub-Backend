import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { organizations } from '../../database/schema/organizations';
import { eq } from 'drizzle-orm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { members } from '../../database/schema/members/members';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService extends DBService {
	async create(createOrganizationDto: CreateOrganizationDto) {
		const member = await this.db
			.insert(members)
			.values({
				role: 'admin',
				name: createOrganizationDto.displayName,
				username: createOrganizationDto.email,
				password: await BcryptUtils.hashPassword(createOrganizationDto.password)
			})
			.returning({
				id: members.id
			});

		const organization = await this.db
			.insert(organizations)
			.values({
				name: createOrganizationDto.organizationName,
				ownerID: member[0].id
			})
			.returning({
				id: organizations.id
			});

		await this.db.update(members).set({
			organizationID: organization[0].id
		});
	}

	async update(
		updateOrganizationAdminDto: UpdateOrganizationDto,
		organizationID: number
	) {
		await this.db
			.update(organizations)
			.set({
				name: updateOrganizationAdminDto.name
			})
			.where(eq(organizations.id, organizationID));
	}

	async delete(organizationID: number) {
		await this.db
			.delete(organizations)
			.where(eq(organizations.id, organizationID));

		// TODO: Delete all sessions related to the recently deleted organization
	}
}
