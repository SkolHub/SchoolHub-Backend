import { ForbiddenException, Injectable, Patch } from '@nestjs/common';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { DBService } from '../../common/db.service';
import { PermissionService } from '../../common/permission.service';
import { posts } from '../../database/schema/posts';
import { and, eq, sql } from 'drizzle-orm';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';

@Injectable()
export class PostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async createStudentPost(createPostDto: CreateStudentPostDto) {
		const isStudent = this.permissionService.isStudentInSubject(
			this.userID,
			createPostDto.subjectID
		);

		if (!isStudent) {
			throw new ForbiddenException('You are not a student in this subject');
		}

		await this.db.insert(posts).values({
			subjectID: createPostDto.subjectID,
			body: createPostDto.body,
			memberID: this.userID,
			title: createPostDto.title,
			type: 'announcement'
		});
	}

	async createTeacherPost(createPostDto: CreateTeacherPostDto) {
		const isTeacher = this.permissionService.isTeacherInSubject(
			this.userID,
			createPostDto.subjectID
		);

		if (!isTeacher) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		await this.db.insert(posts).values({
			subjectID: createPostDto.subjectID,
			body: createPostDto.body,
			memberID: this.userID,
			title: createPostDto.title,
			type: createPostDto.type,
			dueDate: createPostDto.dueDate
		});
	}

	getOrganizationPostsStudent() {
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
			.where(eq(studentsToSubjects.studentID, this.userID))
			.innerJoin(
				posts,
				and(
					eq(posts.subjectID, studentsToSubjects.subjectID),
					eq(posts.type, 'assignment')
				)
			);
	}

	getOrganizationPostsTeacher() {
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
			.where(eq(teachersToSubjects.teacherID, this.userID))
			.innerJoin(
				posts,
				and(
					eq(posts.subjectID, teachersToSubjects.subjectID),
					eq(posts.type, 'assignment')
				)
			);
	}

	getSubjectPostsStudent(subjectID: number) {
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
					eq(studentsToSubjects.studentID, this.userID),
					eq(studentsToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, studentsToSubjects.subjectID)));
	}

	getSubjectPostsTeacher(subjectID: number) {
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
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, teachersToSubjects.subjectID)));
	}

	async getPostByIDAsStudent(postID: number) {
		return (
			await this.db.execute(sql`
          SELECT p.id,
                 p.title,
                 p.body,
                 p."dueDate",
                 p.post_type,
                 p.timestamp,
                 p.updated,
                 jsonb_build_object('id', m.id, 'name', m.name)                                  AS member,
                 jsonb_agg(jsonb_build_object('id', pc.id, 'body', pc.body, 'timestamp', pc.timestamp, 'updated',
                                              pc.updated, 'member',
                                              jsonb_build_object('id', m2.id, 'name', m2.name))) AS comments
          FROM "Post" p
                   INNER JOIN "StudentToSubject" sts
                              ON sts."subjectID" = p."subjectID" AND sts."studentID" = ${this.userID}
                   INNER JOIN "Member" m ON m.id = p."memberID"
                   LEFT JOIN "PostComment" pc ON pc."postID" = ${postID}
                   LEFT JOIN "Member" m2 ON m2.id = pc."userID"
          WHERE p.id = ${postID}
          GROUP BY p.id, m.id
			`)
		).rows[0];
	}

	async getPostByIDAsTeacher(postID: number) {
		return (await this.db.execute(sql`
        SELECT p.id,
               p.title,
               p.body,
               p."dueDate",
               p.post_type,
               p.timestamp,
               p.updated,
               jsonb_build_object('id', m.id, 'name', m.name)                                  AS member,
               jsonb_agg(jsonb_build_object('id', pc.id, 'body', pc.body, 'timestamp', pc.timestamp, 'updated',
                                            pc.updated, 'member',
                                            jsonb_build_object('id', m2.id, 'name', m2.name))) AS comments
        FROM "Post" p
                 INNER JOIN "TeacherToSubject" tts
                            ON tts."subjectID" = p."subjectID" AND tts."teacherID" = ${this.userID}
                 INNER JOIN "Member" m ON m.id = p."memberID"
                 LEFT JOIN "PostComment" pc ON pc."postID" = ${postID}
                 LEFT JOIN "Member" m2 ON m2.id = pc."userID"
        WHERE p.id = ${postID}
        GROUP BY p.id, m.id
		`)).rows[0];
	}

	@Patch(':id')
	async updateStudentPost(postID: number, updatePostDto: UpdateStudentPostDto) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body,
				updated: sql`CURRENT_TIMESTAMP`
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}

	@Patch(':id')
	async updateTeacherPost(
		postID: number,
		updateTeacherPostDto: UpdateTeacherPostDto
	) {
		await this.db
			.update(posts)
			.set({
				title: updateTeacherPostDto.title,
				body: updateTeacherPostDto.body,
				dueDate: updateTeacherPostDto.dueDate
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}

	async remove(postID: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}
}
