import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { posts } from '../../../database/schema/posts';
import { PermissionService } from '../../../common/permission.service';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';
import { and, eq, sql } from 'drizzle-orm';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { postSections } from '../../../database/schema/post-sections';

@Injectable()
export class TeacherPostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createPostDto: CreateTeacherPostDto) {
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
			dueDate: createPostDto.dueDate,
			sectionID: createPostDto.sectionID
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

	getSubjectPosts(subjectID: number) {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				body: posts.body,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp,
				section: postSections.name
			})
			.from(teachersToSubjects)
			.where(
				and(
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, teachersToSubjects.subjectID)))
			.leftJoin(postSections, eq(postSections.id, posts.sectionID));
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
                       psec.name                                                                                      AS section,
                       jsonb_build_object('id', m.id, 'name', m.name)                                                 AS member,
                       (CASE
                            WHEN COUNT(pc) = 0 THEN '[]'::jsonb
                            ELSE jsonb_agg(jsonb_build_object('id', pc.id, 'body', pc.body, 'timestamp', pc.timestamp,
                                                              'updated',
                                                              pc.updated, 'member',
                                                              jsonb_build_object('id', m2.id, 'name', m2.name))) END) AS comments,
                       (CASE
                            WHEN COUNT(ps) = 0 THEN '[]'::jsonb
                            ELSE jsonb_agg(jsonb_build_object('studentID', ps."studentID", 'status',
                                                              ps."submission_status", 'comment', ps."comment",
                                                              'gradeID',
                                                              ps."gradeID", 'timestamp',
                                                              ps."timestamp")) END)                                   AS submissions
                FROM "Post" p

                         INNER JOIN "Member" m ON m.id = p."memberID"
                         LEFT JOIN "PostSection" psec ON psec.id = p."sectionID"
                         LEFT JOIN "PostComment" pc ON pc."postID" = ${postID}
                         LEFT JOIN "Member" m2 ON m2.id = pc."userID"
                         LEFT JOIN "PostSubmission" ps ON ps."postID" = ${postID}
                WHERE p.id = ${postID}
                GROUP BY p.id, m.id
            `)
		).rows;
	}

	async update(postID: number, updateTeacherPostDto: UpdateTeacherPostDto) {
		await this.db
			.update(posts)
			.set({
				title: updateTeacherPostDto.title,
				body: updateTeacherPostDto.body,
				dueDate: updateTeacherPostDto.dueDate,
				sectionID: updateTeacherPostDto.sectionID
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}
}
