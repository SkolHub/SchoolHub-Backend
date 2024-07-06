import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { ExcuseAbsencesDto } from './dto/excuse-absences.dto';

@Controller()
@UseGuards(TeacherGuard)
export class AbsenceController {
	constructor(private readonly absenceService: AbsenceService) {}

	@Post()
	createMany(@Body() createAbsenceDto: CreateAbsencesDto) {
		return this.absenceService.create(createAbsenceDto);
	}

	@Patch(':id')
	update(@Body() updateAbsenceDto: UpdateAbsenceDto, @Param('id') id: string) {
		return this.absenceService.update(updateAbsenceDto, +id);
	}

	@Patch('excuse/:id')
	excuse(@Body() excuseAbsencesDto: ExcuseAbsencesDto) {
		return this.absenceService.excuse(excuseAbsencesDto);
	}

	@Delete()
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.absenceService.remove(deleteByIdDto);
	}
}
