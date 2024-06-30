import { Injectable } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { organizations } from '../../../database/schema/organizations';
import { DBService } from '../../../common/db.service';

@Injectable()
export class OrganizationAdminService extends DBService {
	async update(updateOrganizationAdminDto: UpdateOrganizationDto) {
		await this.db.update(organizations).set({
			name: updateOrganizationAdminDto.name
		});
	}
}
