import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { OrganizationAdminService } from './organization-admin.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class OrganizationAdminController {
	constructor(
		private readonly organizationAdminService: OrganizationAdminService
	) {}

	@Post('generate-users')
	generateUsers() {}

	@Patch()
	update(@Body() updateOrganizationAdminDto: UpdateOrganizationDto) {
		return this.organizationAdminService.update(updateOrganizationAdminDto);
	}
}
