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
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { RawMemberSession } from '../../types/session';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';

@Controller()
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post('student')
	@UseGuards(StudentGuard)
	createStudentPost(
		@Body() createStudentPostDto: CreateStudentPostDto,
		@Session() session: RawMemberSession
	) {
		return this.postService.createStudentPost(
			createStudentPostDto,
			session.passport.user.userID
		);
	}

	@Post('teacher')
	@UseGuards(TeacherGuard)
	createTeacherPost(
		@Body() createTeacherPostDto: CreateTeacherPostDto,
		@Session() session: RawMemberSession
	) {
		return this.postService.createTeacherPost(
			createTeacherPostDto,
			session.passport.user.userID
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
	updateStudentPost(
		@Body() updateStudentPostDto: UpdateStudentPostDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.updateStudentPost(
			id,
			updateStudentPostDto,
			session.passport.user.userID
		);
	}

	@Patch(':id')
	updateTeacherPost(
		@Body() updateTeacherPostDto: UpdateTeacherPostDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.updateTeacherPost(
			id,
			updateTeacherPostDto,
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
