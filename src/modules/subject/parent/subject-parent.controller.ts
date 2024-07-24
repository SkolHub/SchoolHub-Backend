import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubjectParentService } from './subject-parent.service';
import { ParentGuard } from '../../../shared/guards/parent.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('parent')
@ApiTags('Parent subjects')
@UseGuards(ParentGuard)
export class SubjectParentController {
	constructor(private readonly subjectParentService: SubjectParentService) {}

	@Get()
	@ApiOperation({
		description:
			'Gets all subjects grouped with school classes of the student of the current parent. Includes teachers, metadata, ' +
			'the number of grades for each subject and the average for each subject',
		summary: 'Get subjects with metrics'
	})
	findMany() {
		return this.subjectParentService.findMany();
	}

	@Get('overall-metrics')
	@ApiOperation({
		description:
			'Gets the number of excused and not excused absences as well as the overall average of the student of the current parent'
	})
	findMetrics() {
		return this.subjectParentService.overallMetrics();
	}
}
