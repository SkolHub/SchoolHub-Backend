import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Session
} from '@nestjs/common';
import { SchoolClassesService } from './school-classes.service';
import { RawMemberSession } from '../../types/session';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { DeleteSchoolClassesDto } from './dto/delete-school-classes.dto';

@Controller('school-classes')
export class SchoolClassesController {
	constructor(private readonly schoolClassesService: SchoolClassesService) {}

	@Post()
	createMany(
		@Body() createSchoolClassesDto: CreateSchoolClassesDto,
		@Session() session: RawMemberSession
	) {
		return this.schoolClassesService.createMany(
			createSchoolClassesDto,
			session.passport.user.organizationID
		);
	}

	@Get(':id')
	findOne(@Param('id') id: number, @Session() session: RawMemberSession) {
		return this.schoolClassesService.findOne(
			id,
			session.passport.user.organizationID
		);
	}

	@Get()
	findMany(@Session() session: RawMemberSession) {
		return this.schoolClassesService.findMany(
			session.passport.user.organizationID
		);
	}

	@Patch(':id')
	update(
		@Body() updateSchoolClassDto: UpdateSchoolClassDto,
		@Param('id') id: number,
		@Session() session: RawMemberSession
	) {
		return this.schoolClassesService.update(
			updateSchoolClassDto,
			id,
			session.passport.user.organizationID
		);
	}

	@Delete()
	removeMany(
		@Body() deleteSchoolClassesDto: DeleteSchoolClassesDto,
		@Session() session: RawMemberSession
	) {
		return this.schoolClassesService.removeMany(
			deleteSchoolClassesDto,
			session.passport.user.organizationID
		);
	}
}
