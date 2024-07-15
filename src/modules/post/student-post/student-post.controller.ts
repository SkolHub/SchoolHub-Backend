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
import { StudentPostService } from './student-post.service';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('student')
@ApiTags('Student posts')
@UseGuards(StudentGuard)
export class StudentPostController {
	constructor(private readonly studentPostService: StudentPostService) {}

	@Post()
	@UseInterceptors(
		FileInterceptor('files', {
			storage: diskStorage({
				destination: './uploads',
				filename(_req, file, callback) {
					const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.filename}`;
					callback(null, filename);
				}
			}),
			limits: {
				files: 5,
				fileSize: 50_000_000,
				fieldNameSize: 300
			}
		})
	)
	@ApiOperation({
		description:
			'Creates a post as student. Students may only create announcements. Also processes attachments',
		summary: 'Create post'
	})
	create(
		@Body() createStudentPostDto: CreateStudentPostDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		return this.studentPostService.create(createStudentPostDto, files);
	}

	@Get('organization')
	@ApiOperation({
		description: 'Gets all assignments from all subjects the student is in',
		summary: 'Get organization posts'
	})
	getOrganizationPosts() {
		return this.studentPostService.getOrganizationPosts();
	}

	@Get('subject/:id')
	@ApiOperation({
		description: 'Gets all posts from a subject by ID for the current student',
		summary: 'Get subject posts'
	})
	getSubjectPosts(@Param('id', ParseIntPipe) id: number) {
		return this.studentPostService.getSubjectPosts(id);
	}

	@Get(':id')
	@ApiOperation({
		description:
			'Gets a post by ID for the current student. Includes more information such as comments, submission and attachments',
		summary: 'Get post'
	})
	getPostByID(@Param('id', ParseIntPipe) id: number) {
		return this.studentPostService.getPostByID(id);
	}

	@Patch(':id')
	@ApiOperation({
		description:
			'Updates a post by ID. Students can only update body and title since they can only create announcements',
		summary: 'Update post'
	})
	update(
		@Body() updateStudentPostDto: UpdateStudentPostDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.studentPostService.update(id, updateStudentPostDto);
	}
}
