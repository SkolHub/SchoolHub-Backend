import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { organizations } from '../../../database/schema/organizations';
import { members } from '../../../database/schema/members/members';
import { BcryptUtils } from '../../../common/utils/bcrypt.utils';
import { DBService } from '../../../common/db.service';

@Injectable()
export class OrganizationCommonService extends DBService {
	async create(createOrganizationDto: CreateOrganizationDto) {
		const member = await this.db
			.insert(members)
			.values({
				organizationID: 0,
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
}
