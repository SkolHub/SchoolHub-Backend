import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DBService } from '../../common/db.service';
import { PermissionService } from '../../common/permission.service';
import { posts } from '../../database/schema/posts';
import { and, eq } from 'drizzle-orm';
import { Role } from '../../types/session';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';

@Injectable()
export class PostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createPostDto: CreatePostDto, teacherID: number, role: Role) {
		if (role === 'student' && createPostDto.type !== 'announcement') {
			throw new ForbiddenException('Students can only create announcements');
		}

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
			type: createPostDto.type
		});

		// TODO: Fix post creation
	}

	getOrganizationPostsStudent(userID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title
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
				title: posts.title
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
				title: posts.title
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
				title: posts.title
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

	async update(
		postID: number,
		updatePostDto: UpdatePostDto,
		teacherID: number
	) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body,
				type: updatePostDto.type
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}

	async remove(postID: number, teacherID: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}
}
