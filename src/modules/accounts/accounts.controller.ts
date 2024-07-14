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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Member accounts')
@UseGuards(AdminGuard)
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post('student')
	@ApiOperation({
		description: 'Creates multiple students from a list',
		summary: 'Create students'
	})
	addStudents(@Body() addMembersDto: AddMembersDto) {
		return this.accountsService.addStudents(addMembersDto);
	}

	@Post('teacher')
	@ApiOperation({
		description: 'Creates multiple teachers from a list',
		summary: 'Create teachers'
	})
	addTeachers(@Body() addMembersDto: AddMembersDto) {
		return this.accountsService.addTeachers(addMembersDto);
	}

	@Post('parent')
	@ApiOperation({
		description: 'Creates multiple parents from a list',
		summary: 'Create parents'
	})
	addParents(@Body() addParentsDto: AddParentsDto) {
		return this.accountsService.addParents(addParentsDto);
	}

	@Get('student')
	@ApiOperation({ description: 'Gets all students', summary: 'Get students' })
	getStudents() {
		return this.accountsService.getStudents();
	}

	@Get('teacher')
	@ApiOperation({ description: 'Gets all teachers', summary: 'Get teachers' })
	getTeachers() {
		return this.accountsService.getTeachers();
	}

	@Get('parent')
	@ApiOperation({ description: 'Gets all parents', summary: 'Get parents' })
	getParents() {
		return this.accountsService.getParents();
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a non-admin member',
		summary: 'Update member'
	})
	update(
		@Body() updateMemberDto: UpdateMemberDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.update(updateMemberDto, id);
	}

	@Patch('password/:id')
	@ApiOperation({
		description: 'Resets the password of a non-admin member',
		summary: 'Reset member password'
	})
	resetPassword(
		@Body() resetPasswordMemberDto: ResetPasswordMemberDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.resetPassword(resetPasswordMemberDto, id);
	}

	@Delete()
	@ApiOperation({
		description: 'Deletes a non-admin member',
		summary: 'Delete member'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.accountsService.remove(deleteByIdDto);
	}
}
