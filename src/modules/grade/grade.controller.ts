import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { RawMemberSession } from '../../types/session';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { StudentGuard } from '../../shared/guards/student.guard';

@Controller()
@UseGuards(TeacherGuard)
export class GradeController {
	constructor(private readonly gradeService: GradeService) {}

	@Post()
	createMany(
		@Body() createGradesDto: CreateGradesDto,
		@Session() session: RawMemberSession
	) {
		return this.gradeService.create(
			createGradesDto,
			session.passport.user.userID
		);
	}

	@Get('student/organization')
	@UseGuards(StudentGuard)
	getOrganizationObjectsStudent(@Session() session: RawMemberSession) {
		return this.gradeService.getOrganizationObjectsStudent(
			session.passport.user.userID
		);
	}

	@Get('student/subject/:id')
	@UseGuards(StudentGuard)
	getSubjectObjectsStudent(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.gradeService.getSubjectObjectsStudent(
			id,
			session.passport.user.userID
		);
	}

	@Patch(':id')
	update(
		@Body() updateGradeDto: UpdateGradeDto,
		@Param('id') id: string,
		@Session() session: RawMemberSession
	) {
		return this.gradeService.update(
			updateGradeDto,
			+id,
			session.passport.user.userID
		);
	}

	@Delete()
	remove(
		@Body() deleteByIdDto: DeleteByIdDto,
		@Session() session: RawMemberSession
	) {
		return this.gradeService.remove(
			deleteByIdDto,
			session.passport.user.userID
		);
	}
}
