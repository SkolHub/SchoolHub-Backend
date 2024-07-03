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
import { SubjectAdminService } from './subject-admin.service';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { RawMemberSession } from '../../../types/session';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DeleteSubjectsDto } from './dto/delete-subjects.dto';
import { AddMembersToSubjectDto } from './dto/add-members-to-subject.dto';

@Controller()
@UseGuards(AdminGuard)
export class SubjectAdminController {
	constructor(private readonly subjectService: SubjectAdminService) {}

	@Post()
	createMany(
		@Body() createSubjectsDto: CreateSubjectsDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.createMany(
			createSubjectsDto,
			session.passport.user.organizationID
		);
	}

	@Post('student')
	async addStudents(
		@Body() addMembersToSubjectDto: AddMembersToSubjectDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.addStudents(
			addMembersToSubjectDto,
			session.passport.user.organizationID
		);
	}

	@Post('teacher')
	async addTeachers(
		@Body() addMembersToSubjectDto: AddMembersToSubjectDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.addTeachers(
			addMembersToSubjectDto,
			session.passport.user.organizationID
		);
	}

	@Get(':id')
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.findOne(
			id,
			session.passport.user.organizationID
		);
	}

	@Get()
	findMany(@Session() session: RawMemberSession) {
		return this.subjectService.findMany(session.passport.user.organizationID);
	}

	@Patch(':id')
	update(
		@Body() updateSubjectDto: UpdateSubjectDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.update(
			updateSubjectDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Delete()
	removeMany(
		@Body() deleteSubjectsDto: DeleteSubjectsDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.removeMany(
			deleteSubjectsDto,
			session.passport.user.organizationID
		);
	}

	@Delete('student')
	async removeStudents(
		@Body() addMembersToSubjectDto: AddMembersToSubjectDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.removeStudents(
			addMembersToSubjectDto,
			session.passport.user.organizationID
		);
	}

	@Delete('teacher')
	async removeTeachers(
		@Body() addMembersToSubjectDto: AddMembersToSubjectDto,
		@Session() session: RawMemberSession
	) {
		return this.subjectService.removeTeachers(
			addMembersToSubjectDto,
			session.passport.user.organizationID
		);
	}
}
