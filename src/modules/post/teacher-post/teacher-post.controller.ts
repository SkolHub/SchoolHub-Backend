import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { TeacherPostService } from './teacher-post.service';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('teacher')
@ApiTags('Teacher posts')
@UseGuards(TeacherGuard)
export class TeacherPostController {
	constructor(private readonly teacherPostService: TeacherPostService) {}

	@Post()
	@UseInterceptors(
		FilesInterceptor('files', 5, {
			storage: diskStorage({
				destination: './uploads',
				filename(_req, file, callback) {
					const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
					callback(null, filename);
				}
			}),
			limits: {
				fileSize: 50_000_000,
				fieldNameSize: 300
			}
		})
	)
	@ApiOperation({
		description: 'Creates a post as teacher. Also processes attachments',
		summary: 'Create post'
	})
	create(
		@Body() createTeacherPostDto: CreateTeacherPostDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		return this.teacherPostService.create(createTeacherPostDto, files);
	}

	@Get('organization')
	@ApiOperation({
		description:
			'Gets all assignments from all subjects the teacher is in, even the ones that other teachers created',
		summary: 'Get organization posts'
	})
	getOrganizationPosts() {
		return this.teacherPostService.getOrganizationPosts();
	}

	@Get('subject/:id')
	@ApiOperation({
		description: 'Gets all posts from a subject by ID for the current teacher',
		summary: 'Get subject posts'
	})
	getSubjectPosts(@Param('id', ParseIntPipe) id: number) {
		return this.teacherPostService.getSubjectPosts(id);
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets a post by ID for the current teacher. Includes more information such as comments and attachments',
		summary: 'Get post'
	})
	getPostByID(@Param('id', ParseIntPipe) id: number) {
		return this.teacherPostService.getPostByID(id);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a post by ID',
		summary: 'Update post'
	})
	update(
		@Body() updateTeacherPostDto: UpdateTeacherPostDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.teacherPostService.update(id, updateTeacherPostDto);
	}
}
