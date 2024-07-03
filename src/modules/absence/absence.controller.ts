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
import { AbsenceService } from './absence.service';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { RawMemberSession } from '../../types/session';
import { DeleteAbsencesDto } from './dto/delete-absences.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';

@Controller()
@UseGuards(TeacherGuard)
export class AbsenceController {
	constructor(private readonly absenceService: AbsenceService) {}

	@Post()
	createMany(
		@Body() createAbsenceDto: CreateAbsencesDto,
		@Session() session: RawMemberSession
	) {
		return this.absenceService.create(
			createAbsenceDto,
			session.passport.user.userID
		);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Session() session: RawMemberSession) {
		return this.absenceService.findOne(+id, session.passport.user.userID);
	}

	@Patch(':id')
	update(
		@Body() updateAbsenceDto: UpdateAbsenceDto,
		@Param('id') id: string,
		@Session() session: RawMemberSession
	) {
		return this.absenceService.update(
			updateAbsenceDto,
			+id,
			session.passport.user.userID
		);
	}

	@Delete()
	remove(
		@Body() deleteAbsencesDto: DeleteAbsencesDto,
		@Session() session: RawMemberSession
	) {
		return this.absenceService.remove(
			deleteAbsencesDto,
			session.passport.user.userID
		);
	}
}
