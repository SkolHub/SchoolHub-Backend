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
import { SubjectAdminService } from './subject-admin.service';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AddMembersToSubjectDto } from './dto/add-members-to-subject.dto';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';

@Controller()
@UseGuards(AdminGuard)
export class SubjectAdminController {
	constructor(private readonly subjectService: SubjectAdminService) {}

	@Post()
	createMany(@Body() createSubjectsDto: CreateSubjectsDto) {
		return this.subjectService.createMany(createSubjectsDto);
	}

	@Post('student')
	async addStudents(@Body() addMembersToSubjectDto: AddMembersToSubjectDto) {
		return this.subjectService.addStudents(addMembersToSubjectDto);
	}

	@Post('teacher')
	async addTeachers(@Body() addMembersToSubjectDto: AddMembersToSubjectDto) {
		return this.subjectService.addTeachers(addMembersToSubjectDto);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.subjectService.findOne(id);
	}

	@Get()
	findMany() {
		return this.subjectService.findMany();
	}

	@Patch(':id')
	update(
		@Body() updateSubjectDto: UpdateSubjectDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.subjectService.update(updateSubjectDto, id);
	}

	@Delete()
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.subjectService.remove(deleteByIdDto);
	}

	@Delete('student')
	async removeStudents(@Body() addMembersToSubjectDto: AddMembersToSubjectDto) {
		return this.subjectService.removeStudents(addMembersToSubjectDto);
	}

	@Delete('teacher')
	async removeTeachers(@Body() addMembersToSubjectDto: AddMembersToSubjectDto) {
		return this.subjectService.removeTeachers(addMembersToSubjectDto);
	}
}
