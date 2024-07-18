import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { StudentAbsenceService } from './student-absence.service';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('student')
@ApiTags('Student absences')
@UseGuards(StudentGuard)
export class StudentAbsenceController {
	constructor(private readonly studentAbsenceService: StudentAbsenceService) {}

	@Get()
	@ApiOperation({
		description: 'Get all absences of the current student',
		summary: 'Get absences'
	})
	findAll() {
		return this.studentAbsenceService.findAll();
	}

	@Get(':id')
	@ApiOperation({
		description: 'Get all absences of the current student in a subject',
		summary: 'Get subject absences'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.studentAbsenceService.findOne(id);
	}
}
