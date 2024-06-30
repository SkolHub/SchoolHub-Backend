import { Injectable } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { organizations } from '../../../database/schema/organizations';
import { DBService } from '../../../common/db.service';
import { GenerateTaggedAccountsDto } from './dto/generate-tagged-accounts.dto';
import { members } from '../../../database/schema/members/members';
import { GenerateAccountsDto } from './dto/generate-accounts.dto';
import { tagged } from '../../../database/schema/members/tagged';

@Injectable()
export class OrganizationAdminService extends DBService {
	async generateAccounts(
		generateAccountsDto: GenerateAccountsDto,
		organizationID: number,
		role: 'student' | 'teacher' | 'parent'
	) {
		return this.db
			.insert(members)
			.values(
				generateAccountsDto.accounts.map((account) => ({
					organizationID,
					role,
					name: account.name,
					username: account.username,
					password: account.password
				}))
			)
			.returning({
				id: members.id
			});
	}

	async generateTaggedAccounts(
		generateTaggedAccountsDto: GenerateTaggedAccountsDto,
		organizationID: number,
		role: 'student' | 'teacher'
	) {
		const members = await this.generateAccounts(
			generateTaggedAccountsDto,
			organizationID,
			role
		);

		await this.db.insert(tagged).values(
			generateTaggedAccountsDto.accounts.map((account, index) => ({
				memberID: members[index].id,
				tags: account.tags
			}))
		);
	}

	async update(updateOrganizationAdminDto: UpdateOrganizationDto) {
		await this.db.update(organizations).set({
			name: updateOrganizationAdminDto.name
		});
	}
}
