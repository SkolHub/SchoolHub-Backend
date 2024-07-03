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
import { SchoolClassAdminService } from './school-class-admin.service';
import { RawMemberSession } from '../../../types/session';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { DeleteSchoolClassesDto } from './dto/delete-school-classes.dto';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { AddMembersToSchoolClassDto } from './dto/add-members-to-school-class.dto';

@Controller()
@UseGuards(AdminGuard)
export class SchoolClassAdminController {
	constructor(private readonly schoolClassesService: SchoolClassAdminService) {}

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

	@Post('student')
	async addStudents(
		@Body() addMembersToSchoolClassDto: AddMembersToSchoolClassDto,
		@Session() session: RawMemberSession
	) {
		return this.schoolClassesService.addStudents(
			addMembersToSchoolClassDto,
			session.passport.user.organizationID
		);
	}

	@Get(':id')
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
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
		@Param('id', ParseIntPipe) id: number,
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

	@Delete('student')
	async removeStudents(
		@Body() addMembersToSchoolClassDto: AddMembersToSchoolClassDto,
		@Session() session: RawMemberSession
	) {
		return this.schoolClassesService.removeStudents(
			addMembersToSchoolClassDto,
			session.passport.user.organizationID
		);
	}
}
