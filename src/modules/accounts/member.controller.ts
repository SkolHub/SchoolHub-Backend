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
import { RawMemberSession } from '../../types/session';
import { MemberService } from './member.service';
import { RoleValidationPipe } from '../../common/pipes/role-validation.pipe';
import { AddTaggedAccountsDto } from './dto/add-tagged-accounts.dto';
import { AddParentAccountsDto } from './dto/add-parent-accounts.dto';
import { DeleteAccountsDto } from './dto/delete-accounts.dto';
import { UpdateTaggedDto } from './dto/update-tagged.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@UseGuards(AdminGuard)
@Controller()
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@Post('student')
	createStudent(
		@Body() addTaggedAccountsDto: AddTaggedAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.createTagged(
			addTaggedAccountsDto,
			'student',
			session.passport.user.organizationID
		);
	}

	@Post('teacher')
	createTeacher(
		@Body() addTaggedAccountsDto: AddTaggedAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.createTagged(
			addTaggedAccountsDto,
			'teacher',
			session.passport.user.organizationID
		);
	}

	@Post('parent')
	createParent(
		@Body() addParentAccounts: AddParentAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.createParents(
			addParentAccounts,
			session.passport.user.organizationID
		);
	}

	@Get(':role')
	findAll(
		@Param('role', RoleValidationPipe) role: 'teacher' | 'student' | 'parent',
		@Session() session: RawMemberSession
	) {
		return this.memberService.findAll(
			role,
			session.passport.user.organizationID
		);
	}

	@Patch('account/:id')
	updateAccount(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateAccountDto: UpdateAccountDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.updateAccount(
			updateAccountDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Patch('tags/:id')
	updateTeacher(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateTaggedDto: UpdateTaggedDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.updateTags(
			updateTaggedDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Delete()
	remove(
		@Body() deleteAccountsDto: DeleteAccountsDto,
		@Session() session: RawMemberSession
	) {
		return this.memberService.remove(
			deleteAccountsDto,
			session.passport.user.organizationID
		);
	}
}
