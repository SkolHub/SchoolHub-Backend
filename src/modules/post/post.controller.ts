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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RawMemberSession } from '../../types/session';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';

@Controller()
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(
		@Body() createPostDto: CreatePostDto,
		@Session() session: RawMemberSession
	) {
		return this.postService.create(
			createPostDto,
			session.passport.user.userID,
			session.passport.user.role
		);
	}

	@Get('student/organization')
	@UseGuards(StudentGuard)
	getOrganizationPostsStudent(@Session() session: RawMemberSession) {
		return this.postService.getOrganizationPostsStudent(
			session.passport.user.userID
		);
	}

	@Get('teacher/organization')
	@UseGuards(TeacherGuard)
	getOrganizationPostsTeacher(@Session() session: RawMemberSession) {
		return this.postService.getOrganizationPostsTeacher(
			session.passport.user.userID
		);
	}

	@Get('student/subject/:id')
	@UseGuards(StudentGuard)
	getSubjectPostsStudent(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.getSubjectPostsStudent(
			id,
			session.passport.user.userID
		);
	}

	@Get('teacher/subject/:id')
	@UseGuards(TeacherGuard)
	getSubjectPostsTeacher(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.getSubjectPostsTeacher(
			id,
			session.passport.user.userID
		);
	}

	@Patch(':id')
	update(
		@Body() updatePostDto: UpdatePostDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.update(
			id,
			updatePostDto,
			session.passport.user.userID
		);
	}

	@Delete(':id')
	remove(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.remove(id, session.passport.user.userID);
	}
}
