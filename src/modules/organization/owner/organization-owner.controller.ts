import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { OrganizationOwnerService } from './organization-owner.service';
import { RawMemberSession } from '../../../types/session';
import { OwnerGuard } from '../../../shared/guards/owner.guard';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('owner')
@UseGuards(OwnerGuard)
export class OrganizationOwnerController {
	constructor(
		private readonly organizationOwnerService: OrganizationOwnerService
	) {}

	@Get('admin')
	findAllAdmins(@Session() session: RawMemberSession) {
		return this.organizationOwnerService.findAllAdmins(
			session.passport.user.organizationID
		);
	}

	@Post('admin')
	createAdmin(
		@Body() createAdminDto: CreateAdminDto,
		@Session() session: RawMemberSession
	) {
		return this.organizationOwnerService.createAdmin(
			createAdminDto,
			session.passport.user.organizationID
		);
	}

	@Delete('admin/:id')
	deleteAdmin(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.organizationOwnerService.deleteAdmin(
			id,
			session.passport.user.organizationID
		);
	}

	@Delete()
	delete(@Session() session: RawMemberSession) {
		return this.organizationOwnerService.delete(
			session.passport.user.organizationID
		);
	}
}
