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
import { AccountsAdminService } from './accounts-admin.service';
import { OwnerGuard } from '../../../shared/guards/owner.guard';
import { RawMemberSession } from '../../../types/session';
import { AddAdminDto } from './dto/add-admin.dto';

@Controller('admin')
@UseGuards(OwnerGuard)
export class AccountsAdminController {
	constructor(private readonly accountsAdminService: AccountsAdminService) {}

	@Post()
	create(
		@Body() createAdminDto: AddAdminDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsAdminService.create(
			createAdminDto,
			session.passport.user.organizationID
		);
	}

	@Get()
	findAll(@Session() session: RawMemberSession) {
		return this.accountsAdminService.findAll(
			session.passport.user.organizationID
		);
	}

	@Delete(':id')
	remove(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsAdminService.remove(
			id,
			session.passport.user.organizationID,
			session.passport.user.userID
		);
	}
}
