import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { posts } from '../../../database/schema/posts';
import { PermissionService } from '../../../common/permission.service';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { and, eq, sql } from 'drizzle-orm';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';

@Injectable()
export class StudentPostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createPostDto: CreateStudentPostDto) {
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

	getOrganizationPosts() {
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

	getSubjectPosts(subjectID: number) {
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

	async getPostByID(postID: number) {
		return (
			await this.db.execute(sql`
                SELECT p.id,
                       p.title,
                       p.body,
                       p."dueDate",
                       p.post_type,
                       p.timestamp,
                       p.updated,
                       ps.submission_status,
                       ps.comment,
                       ps."gradeID",
                       ps.timestamp,
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
                         LEFT JOIN "PostSubmission" ps ON ps."postID" = p.id AND ps."studentID" = ${this.userID}
                WHERE p.id = ${postID}
                GROUP BY p.id, m.id, ps."studentID"
            `)
		).rows[0];
	}

	async update(postID: number, updatePostDto: UpdateStudentPostDto) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body,
				updated: sql`CURRENT_TIMESTAMP`
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}
}
