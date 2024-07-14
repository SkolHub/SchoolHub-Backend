import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Subject')
export class SubjectController {
	constructor(private readonly subjectService: SubjectService) {}

	@Get(':id/students')
	@ApiOperation({
		description: 'Get the students in a subject',
		summary: 'Get students'
	})
	getSubjectStudents(@Param('id', ParseIntPipe) id: number) {
		return this.subjectService.getSubjectStudents(id);
	}

	@Get(':id/teachers')
	@ApiOperation({
		description: 'Get the teachers in a subject',
		summary: 'Get teachers'
	})
	getSubjectTeachers(@Param('id', ParseIntPipe) id: number) {
		return this.subjectService.getSubjectTeachers(id);
	}
}
