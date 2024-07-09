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
import { PostService } from './post.service';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';

@Controller()
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post('student')
	@UseGuards(StudentGuard)
	createStudentPost(@Body() createStudentPostDto: CreateStudentPostDto) {
		return this.postService.createStudentPost(createStudentPostDto);
	}

	@Post('teacher')
	@UseGuards(TeacherGuard)
	createTeacherPost(@Body() createTeacherPostDto: CreateTeacherPostDto) {
		return this.postService.createTeacherPost(createTeacherPostDto);
	}

	@Get('student/organization')
	@UseGuards(StudentGuard)
	getOrganizationPostsStudent() {
		return this.postService.getOrganizationPostsStudent();
	}

	@Get('teacher/organization')
	@UseGuards(TeacherGuard)
	getOrganizationPostsTeacher() {
		return this.postService.getOrganizationPostsTeacher();
	}

	@Get('student/subject/:id')
	@UseGuards(StudentGuard)
	getSubjectPostsStudent(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getSubjectPostsStudent(id);
	}

	@Get('teacher/subject/:id')
	@UseGuards(TeacherGuard)
	getSubjectPostsTeacher(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getSubjectPostsTeacher(id);
	}

	@Get('student/:id')
	getPostByIDAsStudent(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getPostByIDAsStudent(id);
	}

	@Get('teacher/:id')
	getPostByIDAsTeacher(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getPostByIDAsTeacher(id);
	}

	@Patch(':id')
	@UseGuards(StudentGuard)
	updateStudentPost(
		@Body() updateStudentPostDto: UpdateStudentPostDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.postService.updateStudentPost(id, updateStudentPostDto);
	}

	@Patch(':id')
	@UseGuards(TeacherGuard)
	updateTeacherPost(
		@Body() updateTeacherPostDto: UpdateTeacherPostDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.postService.updateTeacherPost(id, updateTeacherPostDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postService.remove(id);
	}
}
