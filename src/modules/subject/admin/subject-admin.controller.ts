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
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LinkObjectsDto } from '../../../common/dto/link-objects.dto';

@Controller()
@ApiTags('Admin subjects')
@UseGuards(AdminGuard)
export class SubjectAdminController {
	constructor(private readonly subjectService: SubjectAdminService) {}

	@Post()
	@ApiOperation({
		description: 'Creates multiple subjects from a list',
		summary: 'Create subjects'
	})
	createMany(@Body() createSubjectsDto: CreateSubjectsDto) {
		return this.subjectService.createMany(createSubjectsDto);
	}

	@Post('student-link')
	@ApiOperation({
		description: 'Adds multiple students to multiple subjects',
		summary: 'Add students'
	})
	async addStudents(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.subjectService.addStudents(linkObjectsDto);
	}

	@Post('teacher-link')
	@ApiOperation({
		description: 'Adds multiple teachers to multiple subjects',
		summary: 'Add teachers'
	})
	async addTeachers(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.subjectService.addTeachers(linkObjectsDto);
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets a subject by ID. Includes students, teachers and school classes',
		summary: 'Get subject'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.subjectService.findOne(id);
	}

	@Get()
	@ApiOperation({
		description:
			'Gets all subjects in the organization. Only includes the ID, name, icon and metadata',
		summary: 'Get subjects'
	})
	findMany() {
		return this.subjectService.findMany();
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a subject by ID',
		summary: 'Update subject'
	})
	update(
		@Body() updateSubjectDto: UpdateSubjectDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.subjectService.update(updateSubjectDto, id);
	}

	@Delete()
	@ApiOperation({
		description: 'Deletes a subject by ID',
		summary: 'Delete subject'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.subjectService.remove(deleteByIdDto);
	}

	@Delete('student-link')
	@ApiOperation({
		description: 'Removes multiple students from multiple subjects',
		summary: 'Remove students'
	})
	async removeStudents(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.subjectService.removeStudents(linkObjectsDto);
	}

	@Delete('teacher-link')
	@ApiOperation({
		description: 'Removes multiple teachers from multiple subjects',
		summary: 'Remove students'
	})
	async removeTeachers(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.subjectService.removeTeachers(linkObjectsDto);
	}
}
