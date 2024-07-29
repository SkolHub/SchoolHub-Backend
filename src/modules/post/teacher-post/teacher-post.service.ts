import {
	BadRequestException,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateTeacherPostDto } from './dto/create-teacher-post.dto';
import { posts } from '../../../database/schema/posts';
import { PermissionService } from '../../../common/permission.service';
import { UpdateTeacherPostDto } from './dto/update-teacher-post.dto';
import { and, eq, sql } from 'drizzle-orm';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { postSections } from '../../../database/schema/post-sections';
import { postAttachments } from '../../../database/schema/post-attachments';
import { subjects } from '../../../database/schema/subjects';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';
import { schoolClasses } from '../../../database/schema/school-classes';

@Injectable()
export class TeacherPostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(
		createPostDto: CreateTeacherPostDto,
		files: Express.Multer.File[]
	) {
		if (createPostDto.attachments) {
			createPostDto.attachments = JSON.parse(createPostDto.attachments);
		}

		const len =
			(files?.length ?? 0) + (createPostDto?.attachments?.length ?? 0);

		if (len > 10) {
			throw new BadRequestException('You can only upload up to 10 attachments');
		}

		const isTeacher = this.permissionService.isTeacherInSubject(
			this.userID,
			+createPostDto.subjectID
		);

		if (!isTeacher) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		const postID = (
			await this.db
				.insert(posts)
				.values({
					subjectID: +createPostDto.subjectID,
					body: createPostDto.body,
					memberID: this.userID,
					title: createPostDto.title,
					type: createPostDto.type,
					dueDate: createPostDto.dueDate,
					sectionID: +createPostDto.sectionID || null
				})
				.returning({
					id: posts.id
				})
		)[0].id;

		if (len) {
			await this.db.insert(postAttachments).values([
				...(files?.map((file) => ({
					source: file.filename,
					postID
				})) ?? []),
				...((createPostDto?.attachments as unknown as string[])?.map(
					(attachment) => ({
						source: attachment,
						postID
					})
				) ?? [])
			]);
		}
	}

	getOrganizationPosts() {
		return this.db
			.select({
				id: posts.id,
				type: posts.type,
				subjectID: posts.subjectID,
				title: posts.title,
				dueDate: posts.dueDate,
				timestamp: posts.timestamp,
				subjectName: subjects.name,
				classes: sql`JSONB_AGG
                    (${schoolClasses.name})`
			})
			.from(teachersToSubjects)
			.where(eq(teachersToSubjects.teacherID, this.userID))
			.innerJoin(
				posts,
				and(
					eq(posts.subjectID, teachersToSubjects.subjectID),
					eq(posts.type, 'assignment')
				)
			)
			.innerJoin(subjects, eq(subjects.id, posts.subjectID))
			.leftJoin(
				subjectsToSchoolClasses,
				eq(subjectsToSchoolClasses.subjectID, subjects.id)
			)
			.innerJoin(
				schoolClasses,
				eq(schoolClasses.id, subjectsToSchoolClasses.schoolClassID)
			)
			.groupBy(subjects.name, posts.id);
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
				section: postSections.name,
				subjectName: subjects.name
			})
			.from(teachersToSubjects)
			.where(
				and(
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, eq(posts.subjectID, teachersToSubjects.subjectID))
			.innerJoin(subjects, eq(subjects.id, posts.subjectID))
			.leftJoin(postSections, eq(postSections.id, posts.sectionID));
	}

	async getPostByID(postID: number) {
		return (
			await this.db.execute(sql`
          SELECT p.id,
                 p.title,
                 p.body,
                 p."dueDate",
                 p."postType",
                 p.timestamp,
                 p.updated,
                 psec.name                                              AS section,
                 jsonb_build_object('id', m.id, 'name', m.name)         AS member,
                 COALESCE((SELECT jsonb_agg(jsonb_build_object('id', pc.id, 'body', pc.body, 'timestamp', pc.timestamp,
                                                               'updated',
                                                               pc.updated, 'member',
                                                               jsonb_build_object('id', m2.id, 'name', m2.name)))
                           FROM "PostComment" pc
                                    INNER JOIN "Member" m2 ON m2.id = pc."userID"
                           WHERE pc."postID" = ${postID}), '[]'::jsonb) AS comments,
                 COALESCE((SELECT jsonb_agg(jsonb_build_object('studentID', ps."studentID", 'status',
                                                               ps."submissionStatus", 'comment', ps."comment",
                                                               'grade',
                                                               jsonb_build_object(
                                                                       'id', g.id, 'value', g.value, 'timestamp',
                                                                       g."timestamp", 'date', g."date", 'reason',
                                                                       g.reason
                                                               ), 'timestamp',
                                                               ps."timestamp", 'studentName', s.name))
                           FROM "PostSubmission" ps
                                    INNER JOIN "Member" s ON s.id = ps."studentID"
                                    left JOIN "Grade" g ON g.id = ps."gradeID"
                           WHERE "postID" = ${postID}), '[]'::jsonb)    AS submissions,
                 COALESCE((SELECT jsonb_agg(jsonb_build_object('id', pa.id, 'source', pa.source))
                           FROM "PostAttachment" pa
                           WHERE pa."postID" = ${postID}), '[]'::jsonb) AS attachments,
                 (SELECT count(*)
                  FROM "StudentToSubject" sts
                  WHERE sts."subjectID" = p."subjectID")::int           AS "studentCount"
          FROM "Post" p
                   INNER JOIN "Member" m
                              ON m.id = p."memberID"
                   LEFT JOIN "PostSection" psec ON psec.id = p."sectionID"
          WHERE p.id = ${postID}
          GROUP BY p.id, m.id, psec.name
			`)
		).rows[0];
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
