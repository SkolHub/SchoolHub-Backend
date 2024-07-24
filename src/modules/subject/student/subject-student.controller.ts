import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { SubjectStudentService } from './subject-student.service';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('student')
@ApiTags('Student subjects')
@UseGuards(StudentGuard)
export class SubjectStudentController {
	constructor(private readonly subjectStudentService: SubjectStudentService) {}

	@Get()
	@ApiOperation({
		description:
			'Gets all subjects grouped with school classes of the current student. Includes teachers',
		summary: 'Get subjects'
	})
	getSubjects() {
		return this.subjectStudentService.getSubjects();
	}

	@Get('with-metrics')
	@ApiOperation({
		description:
			'Gets all subjects grouped with school classes of the current student. Includes teachers, metadata, ' +
			'the number of grades for each subject and the average for each subject',
		summary: 'Get subjects with metrics'
	})
	getSubjectsWithMetrics() {
		return this.subjectStudentService.getSubjectsWithMetrics();
	}

	@Get('overall-metrics')
	@ApiOperation({
		description:
			'Gets the number of excused and not excused absences as well as the overall average of the current student'
	})
	findMetrics() {
		return this.subjectStudentService.overallMetrics();
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets the number of grades, the number of absences and the number of assignments for a subject',
		summary: 'Get subject'
	})
	getSubjectByID(@Param('id', ParseIntPipe) id: number) {
		return this.subjectStudentService.getSubjectByID(id);
	}
}
