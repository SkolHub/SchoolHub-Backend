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
import { Public } from '../../common/decorators/public.decorator';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { OwnerGuard } from '../../shared/guards/owner.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { RawMemberSession } from '../../types/session';

@Controller('organization')
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@Public()
	create(@Body() createOrganizationDto: CreateOrganizationDto) {
		return this.organizationService.create(createOrganizationDto);
	}

	@Patch()
	@UseGuards(AdminGuard)
	update(
		@Body() updateOrganizationDto: UpdateOrganizationDto,
		@Session() session: RawMemberSession
	) {
		return this.organizationService.update(
			updateOrganizationDto,
			session.passport.user.organizationID
		);
	}

	@UseGuards(OwnerGuard)
	@Delete()
	remove(@Session() session: RawMemberSession) {
		return this.organizationService.remove(
			session.passport.user.organizationID
		);
	}
}
