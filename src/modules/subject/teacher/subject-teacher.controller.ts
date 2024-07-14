import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { SubjectTeacherService } from './subject-teacher.service';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('teacher')
@ApiTags('Teacher subjects')
@UseGuards(TeacherGuard)
export class SubjectTeacherController {
	constructor(private readonly subjectTeacherService: SubjectTeacherService) {}

	@Get()
	@ApiOperation({
		description:
			'Gets all subjects grouped by school classes of the current teacher',
		summary: 'Get subjects'
	})
	getSubjects() {
		return this.subjectTeacherService.getSubjects();
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets the average of the subject and the average number of grades in the subject',
		summary: 'Get subject'
	})
	getSubjectByID(@Param('id', ParseIntPipe) id: number) {
		return this.subjectTeacherService.getSubjectByID(id);
	}

	@Get(':id/few-grades')
	@ApiOperation({
		description:
			'Gets the number of students with few grades based on the time from the beginning of the school year to the end',
		summary: 'Get few grades count'
	})
	getStudentsWithFewGradesCount(@Param('id', ParseIntPipe) id: number) {
		return this.subjectTeacherService.getStudentsWithFewGradesCount(id);
	}
}
