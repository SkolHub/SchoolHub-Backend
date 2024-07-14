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
import { TeacherAbsenceService } from './teacher-absence.service';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { ExcuseAbsencesDto } from './dto/excuse-absences.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Teacher absences')
@UseGuards(TeacherGuard)
export class TeacherAbsenceController {
	constructor(private readonly absenceService: TeacherAbsenceService) {}

	@Post()
	@ApiOperation({
		description: 'Creates multiple absences from a list',
		summary: 'Create absences'
	})
	createMany(@Body() createAbsenceDto: CreateAbsencesDto) {
		return this.absenceService.create(createAbsenceDto);
	}

	@Get('subject/:subjectID/student/:studentID')
	@ApiOperation({
		description: 'Get the absences of a student in a subject',
		summary: 'Get absences'
	})
	getStudentAbsences(
		@Param('subjectID', ParseIntPipe) subjectID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.absenceService.getStudentAbsences(subjectID, studentID);
	}

	@Patch('excuse')
	@ApiOperation({
		description:
			'Excuses a list of absences by ID. Cannot be undone. Only the class master can excuse absences',
		summary: 'Excuse absences'
	})
	excuse(@Body() excuseAbsencesDto: ExcuseAbsencesDto) {
		return this.absenceService.excuse(excuseAbsencesDto);
	}

	@Patch(':id')
	@ApiOperation({
		description:
			'Updates the reason of an excused absence. Only the class master can update absences',
		summary: 'Update absence by ID'
	})
	update(@Body() updateAbsenceDto: UpdateAbsenceDto, @Param('id') id: string) {
		return this.absenceService.update(updateAbsenceDto, +id);
	}

	@Delete()
	@ApiOperation({
		description:
			'Deletes a list of absences by ID. Only a teacher that created an absence can delete it',
		summary: 'Delete absences'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.absenceService.remove(deleteByIdDto);
	}
}
