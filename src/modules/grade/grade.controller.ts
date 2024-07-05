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
import { GradeService } from './grade.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { StudentGuard } from '../../shared/guards/student.guard';

@Controller()
export class GradeController {
	constructor(private readonly gradeService: GradeService) {}

	@Post()
	@UseGuards(TeacherGuard)
	createMany(@Body() createGradesDto: CreateGradesDto) {
		return this.gradeService.create(createGradesDto);
	}

	@Get('student/organization')
	@UseGuards(StudentGuard)
	getOrganizationObjectsStudent() {
		return this.gradeService.getOrganizationObjectsStudent();
	}

	@Get('student/subject/:id')
	@UseGuards(StudentGuard)
	getSubjectObjectsStudent(@Param('id', ParseIntPipe) id: number) {
		return this.gradeService.getSubjectObjectsStudent(id);
	}

	@Patch(':id')
	@UseGuards(TeacherGuard)
	update(@Body() updateGradeDto: UpdateGradeDto, @Param('id') id: string) {
		return this.gradeService.update(updateGradeDto, +id);
	}

	@Delete()
	@UseGuards(TeacherGuard)
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.gradeService.remove(deleteByIdDto);
	}
}
