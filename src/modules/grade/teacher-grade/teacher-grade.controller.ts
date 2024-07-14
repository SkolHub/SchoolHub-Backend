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
import { TeacherGradeService } from './teacher-grade.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('teacher')
@ApiTags('Teacher grades')
@UseGuards(TeacherGuard)
export class TeacherGradeController {
	constructor(private readonly gradeService: TeacherGradeService) {}

	@Post()
	@ApiOperation({
		description: 'Create multiple grades from a list',
		summary: 'Create grades'
	})
	createMany(@Body() createGradesDto: CreateGradesDto) {
		return this.gradeService.create(createGradesDto);
	}

	@Get('subject/:subjectID/student/:studentID')
	@ApiOperation({
		description: 'Get the grades of a student in a subject',
		summary: 'Get grades'
	})
	getStudentGrades(
		@Param('subjectID', ParseIntPipe) subjectID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.gradeService.getStudentGrades(subjectID, studentID);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a grade by ID',
		summary: 'Update grade'
	})
	update(
		@Body() updateGradeDto: UpdateGradeDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.gradeService.update(updateGradeDto, id);
	}

	@Delete()
	@ApiOperation({
		description:
			'Deletes a list of grades by ID. Only a teacher that created an absence can delete it',
		summary: 'Delete grades'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.gradeService.remove(deleteByIdDto);
	}
}
