import { ForbiddenException, Injectable, Patch } from '@nestjs/common';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { DBService } from '../../common/db.service';
import { PermissionService } from '../../common/permission.service';
import { posts } from '../../database/schema/posts';
import { and, eq } from 'drizzle-orm';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';

@Injectable()
export class PostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async createStudentPost(
		createPostDto: CreateStudentPostDto,
		studentID: number
	) {
		const isStudent = this.permissionService.isStudentInSubject(
			studentID,
			createPostDto.subjectID
		);

		if (!isStudent) {
			throw new ForbiddenException('You are not a student in this subject');
		}

		await this.db.insert(posts).values({
			subjectID: createPostDto.subjectID,
			body: createPostDto.body,
			memberID: studentID,
			title: createPostDto.title,
			type: 'announcement'
		});
	}

	async createTeacherPost(
		createPostDto: CreateTeacherPostDto,
		teacherID: number
	) {
		const isTeacher = this.permissionService.isTeacherInSubject(
			teacherID,
			createPostDto.subjectID
		);

		if (!isTeacher) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		await this.db.insert(posts).values({
			subjectID: createPostDto.subjectID,
			body: createPostDto.body,
			memberID: teacherID,
			title: createPostDto.title,
			type: createPostDto.type,
			dueDate: createPostDto.dueDate
		});
	}

	getOrganizationPostsStudent(userID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp
			})
			.from(studentsToSubjects)
			.where(eq(studentsToSubjects.studentID, userID))
			.innerJoin(
				posts,
				and(
					eq(posts.subjectID, studentsToSubjects.subjectID),
					eq(posts.type, 'assignment')
				)
			);
	}

	getOrganizationPostsTeacher(userID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp
			})
			.from(teachersToSubjects)
			.where(eq(teachersToSubjects.teacherID, userID))
			.innerJoin(
				posts,
				and(
					eq(posts.subjectID, teachersToSubjects.subjectID),
					eq(posts.type, 'assignment')
				)
			);
	}

	getSubjectPostsStudent(subjectID: number, userID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				body: posts.body,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp
			})
			.from(studentsToSubjects)
			.where(
				and(
					eq(studentsToSubjects.studentID, userID),
					eq(studentsToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, studentsToSubjects.subjectID)));
	}

	getSubjectPostsTeacher(subjectID: number, userID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				body: posts.body,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp
			})
			.from(teachersToSubjects)
			.where(
				and(
					eq(teachersToSubjects.teacherID, userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, teachersToSubjects.subjectID)));
	}

	@Patch(':id')
	async updateStudentPost(
		postID: number,
		updatePostDto: UpdateStudentPostDto,
		studentID: number
	) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, studentID)));
	}

	@Patch(':id')
	async updateTeacherPost(
		postID: number,
		updateTeacherPostDto: UpdateTeacherPostDto,
		teacherID: number
	) {
		await this.db
			.update(posts)
			.set({
				title: updateTeacherPostDto.title,
				body: updateTeacherPostDto.body,
				dueDate: updateTeacherPostDto.dueDate
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}

	async remove(postID: number, teacherID: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}
}
