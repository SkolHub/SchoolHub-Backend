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
import { SchoolClassAdminService } from './school-class-admin.service';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { AddMembersToSchoolClassDto } from './dto/add-members-to-school-class.dto';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';

@Controller()
@UseGuards(AdminGuard)
export class SchoolClassAdminController {
	constructor(private readonly schoolClassesService: SchoolClassAdminService) {}

	@Post()
	createMany(@Body() createSchoolClassesDto: CreateSchoolClassesDto) {
		return this.schoolClassesService.createMany(createSchoolClassesDto);
	}

	@Post('student')
	async addStudents(
		@Body() addMembersToSchoolClassDto: AddMembersToSchoolClassDto
	) {
		return this.schoolClassesService.addStudents(addMembersToSchoolClassDto);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.schoolClassesService.findOne(id);
	}

	@Get()
	findMany() {
		return this.schoolClassesService.findMany();
	}

	@Patch(':id')
	update(
		@Body() updateSchoolClassDto: UpdateSchoolClassDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.schoolClassesService.update(updateSchoolClassDto, id);
	}

	@Delete()
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.schoolClassesService.remove(deleteByIdDto);
	}

	@Delete('student')
	async removeStudents(
		@Body() addMembersToSchoolClassDto: AddMembersToSchoolClassDto
	) {
		return this.schoolClassesService.removeStudents(addMembersToSchoolClassDto);
	}
}
