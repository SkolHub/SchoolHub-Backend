import {
	Body,
	Controller,
	Patch,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { OrganizationAdminService } from './organization-admin.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { GenerateTaggedAccountsDto } from './dto/generate-tagged-accounts.dto';
import { RawMemberSession } from '../../../types/session';

@Controller('admin')
@UseGuards(AdminGuard)
export class OrganizationAdminController {
	constructor(
		private readonly organizationAdminService: OrganizationAdminService
	) {}

	@Post('generate/students')
	generateStudents(
		@Body() generateTaggedAccountsDto: GenerateTaggedAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.organizationAdminService.generateTaggedAccounts(
			generateTaggedAccountsDto,
			session.passport.user.organizationID,
			'student'
		);
	}

	@Post('generate/teachers')
	generateTeachers(
		@Body() generateTaggedAccountsDto: GenerateTaggedAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.organizationAdminService.generateTaggedAccounts(
			generateTaggedAccountsDto,
			session.passport.user.organizationID,
			'teacher'
		);
	}

	@Post('generate/school-classes')
	generateSchoolClasses() {}

	@Post('generate/subjects')
	generateSubjects() {}

	@Patch()
	update(@Body() updateOrganizationAdminDto: UpdateOrganizationDto) {
		return this.organizationAdminService.update(updateOrganizationAdminDto);
	}
}
