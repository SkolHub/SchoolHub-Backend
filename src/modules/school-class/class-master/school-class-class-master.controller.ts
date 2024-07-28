import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { SchoolClassClassMasterService } from './school-class-class-master.service';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('class-master')
@ApiTags('Class master school classes')
@UseGuards(TeacherGuard)
export class SchoolClassClassMasterController {
	constructor(
		private readonly schoolClassMemberService: SchoolClassClassMasterService
	) {}

	@Get('/school-class/:schoolClassID/student/:studentID')
	@ApiOperation({
		description:
			'Gets a student by ID with all of its subjects, grades and absences inside a school class',
		summary: 'Get student'
	})
	findStudent(
		@Param('schoolClassID', ParseIntPipe) schoolClassID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.schoolClassMemberService.findStudent(schoolClassID, studentID);
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets a school class by ID with all of its subjects and students',
		summary: 'Get school class'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.schoolClassMemberService.findOne(id);
	}
}
