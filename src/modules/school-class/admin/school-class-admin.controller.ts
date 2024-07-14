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
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LinkObjectsDto } from '../../../common/dto/link-objects.dto';

@Controller()
@ApiTags('Admin school classes')
@UseGuards(AdminGuard)
export class SchoolClassAdminController {
	constructor(private readonly schoolClassesService: SchoolClassAdminService) {}

	@Post()
	@ApiOperation({
		description: 'Creates multiple school classes from a list',
		summary: 'Create school classes'
	})
	createMany(@Body() createSchoolClassesDto: CreateSchoolClassesDto) {
		return this.schoolClassesService.createMany(createSchoolClassesDto);
	}

	@Post('student')
	@ApiOperation({
		description: 'Adds multiple students to multiple school classes',
		summary: 'Add students'
	})
	addStudents(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.schoolClassesService.addStudents(linkObjectsDto);
	}

	@Post('subject')
	@ApiOperation({
		description: 'Adds multiple subjects to multiple school classes',
		summary: 'Add subjects'
	})
	addSubjects(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.schoolClassesService.addSubjects(linkObjectsDto);
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets a school class by ID. Includes students, subjects and the class master',
		summary: 'Get school class'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.schoolClassesService.findOne(id);
	}

	@Get()
	@ApiOperation({
		description:
			'Gets all school classes in the organization. Only includes the ID and the name',
		summary: 'Get school classes'
	})
	findMany() {
		return this.schoolClassesService.findMany();
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a school class by ID',
		summary: 'Update school class'
	})
	update(
		@Body() updateSchoolClassDto: UpdateSchoolClassDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.schoolClassesService.update(updateSchoolClassDto, id);
	}

	@Delete('student')
	@ApiOperation({
		description: 'Removes multiple students from multiple school classes',
		summary: 'Remove students'
	})
	async removeStudents(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.schoolClassesService.removeStudents(
			linkObjectsDto
		);
	}

	@Delete('student')
	@ApiOperation({
		description: 'Removes multiple subjects from multiple school classes',
		summary: 'Remove subjects'
	})
	async removeSubjects(@Body() linkObjectsDto: LinkObjectsDto) {
		return this.schoolClassesService.removeSubjects(
			linkObjectsDto
		);
	}

	@Delete()
	@ApiOperation({
		description: 'Deletes a school class by ID',
		summary: 'Delete school class'
	})
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.schoolClassesService.remove(deleteByIdDto);
	}
}
