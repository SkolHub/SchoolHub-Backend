import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { TeacherPostSectionService } from './teacher-post-section.service';
import { CreatePostSectionDto } from './dto/create-post-section.dto';
import { UpdatePostSectionDto } from './dto/update-post-section.dto';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Teacher post sections')
@UseGuards(TeacherGuard)
export class TeacherPostSectionController {
	constructor(private readonly postSectionService: TeacherPostSectionService) {}

	@Post()
	@ApiOperation({
		description:
			'Creates a post section in a subject. Only teachers can create post sections',
		summary: 'Create post section'
	})
	create(@Body() createPostSectionDto: CreatePostSectionDto) {
		return this.postSectionService.create(createPostSectionDto);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a section by ID',
		summary: 'Update section'
	})
	update(
		@Param('id') id: string,
		@Body() updatePostSectionDto: UpdatePostSectionDto
	) {
		return this.postSectionService.update(+id, updatePostSectionDto);
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Deletes a section by ID',
		summary: 'Delete section'
	})
	remove(@Param('id') id: string) {
		return this.postSectionService.remove(+id);
	}
}
