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
			'Gets all the students in a subject along with their averages and number of grades',
		summary: 'Get subject'
	})
	getSubjectStudents(@Param('id', ParseIntPipe) id: number) {
		return this.subjectTeacherService.getSubjectStudents(id);
	}

	@Get(':id/grade-metrics')
	@ApiOperation({
		description:
			'Gets the average of the subject and the average number of grades in the subject',
		summary: 'Get subject metrics'
	})
	getSubjectGradeMetricsByID(@Param('id', ParseIntPipe) id: number) {
		return this.subjectTeacherService.getSubjectGradeMetricsByID(id);
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
