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
import { AdminGuard } from '../../shared/guards/admin.guard';
import { AccountsService } from './accounts.service';
import { RawMemberSession } from '../../types/session';
import { AddMembersDto } from './dto/add-members.dto';
import { AddParentsDto } from './dto/add-parents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ResetPasswordMemberDto } from './dto/reset-password-member.dto';
import {DeleteByIdDto} from "../../common/dto/delete-by-id.dto";

@Controller()
@UseGuards(AdminGuard)
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post('student')
	addStudents(
		@Body() addMembersDto: AddMembersDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.addStudents(
			addMembersDto,
			session.passport.user.organizationID
		);
	}

	@Post('teacher')
	addTeachers(
		@Body() addMembersDto: AddMembersDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.addTeachers(
			addMembersDto,
			session.passport.user.organizationID
		);
	}

	@Post('parent')
	addParents(
		@Body() addParentsDto: AddParentsDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.addParents(
			addParentsDto,
			session.passport.user.organizationID
		);
	}

	@Get('student')
	getStudents(@Session() session: RawMemberSession) {
		return this.accountsService.getStudents(
			session.passport.user.organizationID
		);
	}

	@Get('teacher')
	getTeachers(@Session() session: RawMemberSession) {
		return this.accountsService.getTeachers(
			session.passport.user.organizationID
		);
	}

	@Get('parent')
	getParents(@Session() session: RawMemberSession) {
		return this.accountsService.getParents(
			session.passport.user.organizationID
		);
	}

	@Get(':id')
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.findOne(
			id,
			session.passport.user.organizationID
		);
	}

	@Patch(':id')
	update(
		@Body() updateMemberDto: UpdateMemberDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.update(
			updateMemberDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Patch('password/:id')
	resetPassword(
		@Body() resetPasswordMemberDto: ResetPasswordMemberDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.resetPassword(
			resetPasswordMemberDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Delete()
	remove(
		@Body() deleteByIdDto: DeleteByIdDto,
		@Session() session: RawMemberSession
	) {
		return this.accountsService.remove(
			deleteByIdDto,
			session.passport.user.organizationID
		);
	}
}
