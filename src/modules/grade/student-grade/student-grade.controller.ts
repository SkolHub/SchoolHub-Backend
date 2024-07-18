import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { StudentGradeService } from './student-grade.service';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('student')
@ApiTags('Student grades')
@UseGuards(StudentGuard)
export class StudentGradeController {
	constructor(private readonly studentGradeService: StudentGradeService) {}

	@Get()
	@ApiOperation({
		description: 'Get all grades of the current student',
		summary: 'Get grades'
	})
	findAll() {
		return this.studentGradeService.findAll();
	}

	@Get(':id')
	@ApiOperation({
		description: 'Get all grades of the current student in a subject',
		summary: 'Get subject grades'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.studentGradeService.findOne(id);
	}
}
