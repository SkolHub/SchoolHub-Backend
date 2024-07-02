import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { AccountsAdminService } from './accounts-admin.service';
import { OwnerGuard } from '../../../shared/guards/owner.guard';
import { AddAdminDto } from './dto/add-admin.dto';
import { RawMemberSession } from '../../../types/session';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('accounts/admin')
@UseGuards(OwnerGuard)
export class AccountsAdminController {
	constructor(private readonly accountsService: AccountsAdminService) {}

	@Post()
	create(
		@Body() addAdminDto: AddAdminDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.create(
			addAdminDto,
			session.passport.user.organizationID
		);
	}

	@Get()
	findAll(@Session() session: RawMemberSession) {
		return this.accountsService.findAll(session.passport.user.organizationID);
	}

	@Patch(':id')
	update(
		@Body() updateAdminDto: UpdateAdminDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.update(
			updateAdminDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Patch('password/:id')
	resetPassword(
		@Body() resetPasswordAdminDto: ResetPasswordAdminDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.resetPassword(
			resetPasswordAdminDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Delete(':id')
	remove(@Param('id') id: number, @Session() session: RawMemberSession) {
		return this.accountsService.remove(
			id,
			session.passport.user.organizationID
		);
	}
}
