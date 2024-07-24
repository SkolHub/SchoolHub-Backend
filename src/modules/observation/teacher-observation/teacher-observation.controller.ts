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
import { TeacherObservationService } from './teacher-observation.service';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Teacher observations')
@UseGuards(TeacherGuard)
export class TeacherObservationController {
	constructor(private readonly observationService: TeacherObservationService) {}

	@Post()
	@ApiOperation({
		description: 'Create multiple observations from a list',
		summary: 'Create observations'
	})
	create(@Body() createObservationsDto: CreateObservationsDto) {
		return this.observationService.create(createObservationsDto);
	}

	@Get('subject/:subjectID/student/:studentID')
	@ApiOperation({
		description: 'Get the observations of a student in a subject',
		summary: 'Get observations'
	})
	getStudentGrades(
		@Param('subjectID', ParseIntPipe) subjectID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.observationService.getStudentObservations(subjectID, studentID);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates an observation by ID',
		summary: 'Update observation'
	})
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateObservationDto: UpdateObservationDto
	) {
		return this.observationService.update(updateObservationDto, id);
	}

	@Delete()
	@ApiOperation({
		description:
			'Deletes a list of observations by ID. Only the teacher that created the observation can delete it',
		summary: 'Delete observations'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.observationService.remove(deleteByIdDto);
	}
}
