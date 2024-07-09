import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { PostSectionService } from './post-section.service';
import { CreatePostSectionDto } from './dto/create-post-section.dto';
import { UpdatePostSectionDto } from './dto/update-post-section.dto';
import { TeacherGuard } from '../../shared/guards/teacher.guard';

@Controller('post-section')
export class PostSectionController {
	constructor(private readonly postSectionService: PostSectionService) {}

	@Post()
	@UseGuards(TeacherGuard)
	create(@Body() createPostSectionDto: CreatePostSectionDto) {
		return this.postSectionService.create(createPostSectionDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postSectionService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updatePostSectionDto: UpdatePostSectionDto
	) {
		return this.postSectionService.update(+id, updatePostSectionDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postSectionService.remove(+id);
	}
}
