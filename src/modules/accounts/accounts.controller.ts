import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { AccountsService } from './accounts.service';
import { AddMembersDto } from './dto/add-members.dto';
import { AddParentsDto } from './dto/add-parents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ResetPasswordMemberDto } from './dto/reset-password-member.dto';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

@Controller()
@UseGuards(AdminGuard)
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post('student')
	addStudents(@Body() addMembersDto: AddMembersDto) {
		return this.accountsService.addStudents(addMembersDto);
	}

	@Post('teacher')
	addTeachers(@Body() addMembersDto: AddMembersDto) {
		return this.accountsService.addTeachers(addMembersDto);
	}

	@Post('parent')
	addParents(@Body() addParentsDto: AddParentsDto) {
		return this.accountsService.addParents(addParentsDto);
	}

	@Get('student')
	getStudents() {
		return this.accountsService.getStudents();
	}

	@Get('teacher')
	getTeachers() {
		return this.accountsService.getTeachers();
	}

	@Get('parent')
	getParents() {
		return this.accountsService.getParents();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.accountsService.findOne(id);
	}

	@Patch(':id')
	update(
		@Body() updateMemberDto: UpdateMemberDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.update(updateMemberDto, id);
	}

	@Patch('password/:id')
	resetPassword(
		@Body() resetPasswordMemberDto: ResetPasswordMemberDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.resetPassword(resetPasswordMemberDto, id);
	}

	@Delete()
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.accountsService.remove(deleteByIdDto);
	}
}
