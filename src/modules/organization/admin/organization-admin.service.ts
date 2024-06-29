import { Injectable } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationAdminService {
	update(updateOrganizationAdminDto: UpdateOrganizationDto) {
		return `This action updates a #1 organizationAdmin`;
	}
}
