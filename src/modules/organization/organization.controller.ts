import {
	Body,
	Controller,
	Delete,
	Patch,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { RawMemberSession } from '../../types/session';
import { Public } from '../../common/decorators/public.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { OwnerGuard } from '../../shared/guards/owner.guard';

@Controller()
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@Public()
	create(@Body() createOrganizationCommonDto: CreateOrganizationDto) {
		return this.organizationService.create(createOrganizationCommonDto);
	}

	@Patch()
	@UseGuards(AdminGuard)
	update(
		@Body() updateOrganizationAdminDto: UpdateOrganizationDto,
		@Session() session: RawMemberSession
	) {
		return this.organizationService.update(
			updateOrganizationAdminDto,
			session.passport.user.organizationID
		);
	}

	@Delete()
	@UseGuards(OwnerGuard)
	delete(@Session() session: RawMemberSession) {
		return this.organizationService.delete(
			session.passport.user.organizationID
		);
	}
}
