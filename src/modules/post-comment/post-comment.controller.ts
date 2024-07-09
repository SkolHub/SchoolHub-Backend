import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';

@Controller('post-comment')
export class PostCommentController {
	constructor(private readonly postCommentService: PostCommentService) {}

	@Post('student')
	@UseGuards(StudentGuard)
	createStudentComment(@Body() createPostCommentDto: CreatePostCommentDto) {
		return this.postCommentService.createStudentComment(createPostCommentDto);
	}

	@Post('teacher')
	@UseGuards(TeacherGuard)
	createTeacherComment(@Body() createPostCommentDto: CreatePostCommentDto) {
		return this.postCommentService.createTeacherComment(createPostCommentDto);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updatePostCommentDto: UpdatePostCommentDto
	) {
		return this.postCommentService.update(+id, updatePostCommentDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postCommentService.remove(+id);
	}
}
