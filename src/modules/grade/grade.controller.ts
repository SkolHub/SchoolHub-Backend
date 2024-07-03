import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Session,
	UseGuards
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { RawMemberSession } from '../../types/session';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { DeleteGradesDto } from './dto/delete-grades.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';

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

	@Get(':id')
	findOne(@Param('id') id: string, @Session() session: RawMemberSession) {
		return this.gradeService.findOne(+id, session.passport.user.userID);
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
		@Body() deleteGradesDto: DeleteGradesDto,
		@Session() session: RawMemberSession
	) {
		return this.gradeService.remove(
			deleteGradesDto,
			session.passport.user.userID
		);
	}
}
