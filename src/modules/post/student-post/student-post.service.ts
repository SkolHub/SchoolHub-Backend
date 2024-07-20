import {
	BadRequestException,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateStudentPostDto } from './dto/create-student-post.dto';
import { posts } from '../../../database/schema/posts';
import { PermissionService } from '../../../common/permission.service';
import { UpdateStudentPostDto } from './dto/update-student-post.dto';
import { and, eq, sql } from 'drizzle-orm';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import { postSections } from '../../../database/schema/post-sections';
import { postAttachments } from '../../../database/schema/post-attachments';

@Injectable()
export class StudentPostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(
		createPostDto: CreateStudentPostDto,
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

		const isStudent = this.permissionService.isStudentInSubject(
			this.userID,
			+createPostDto.subjectID
		);

		if (!isStudent) {
			throw new ForbiddenException('You are not a student in this subject');
		}

		const postID = (
			await this.db
				.insert(posts)
				.values({
					subjectID: +createPostDto.subjectID,
					body: createPostDto.body,
					memberID: this.userID,
					title: createPostDto.title,
					type: 'announcement',
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
				timestamp: posts.timestamp,
				section: postSections.name
			})
			.from(studentsToSubjects)
			.where(
				and(
					eq(studentsToSubjects.studentID, this.userID),
					eq(studentsToSubjects.subjectID, subjectID)
				)
			)
			.innerJoin(posts, and(eq(posts.subjectID, studentsToSubjects.subjectID)))
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
                 jsonb_build_object('status', ps."submissionStatus", 'comment', ps.comment, 'gradeID', ps."gradeID", 'timestamp', ps.timestamp) AS submission,
                 jsonb_build_object('id', m.id, 'name', m.name)                                                 AS member,
                 (CASE
                      WHEN count(pc) = 0 THEN '[]'::jsonb
                      ELSE jsonb_agg(jsonb_build_object('id', pc.id, 'body', pc.body, 'timestamp', pc.timestamp,
                                                        'updated',
                                                        pc.updated, 'member',
                                                        jsonb_build_object('id', m2.id, 'name', m2.name))) END) AS comments,
                 psec.name AS section,
                       (CASE
                            WHEN count(pa) = 0 THEN '[]'::jsonb
                            ELSE jsonb_agg(jsonb_build_object('id', pa.id, 'source', pa.source)) END)                 AS attachments,
                       (CASE
                            WHEN count(sa) = 0 THEN '[]'::jsonb
                            ELSE jsonb_agg(jsonb_build_object('id', sa.id, 'source', sa.source)) END)                 AS submissions
          FROM "Post" p
              INNER JOIN "StudentToSubject" sts
          ON sts."subjectID" = p."subjectID" AND sts."studentID" = ${this.userID}
              INNER JOIN "Member" m ON m.id = p."memberID"
              LEFT JOIN "PostSection" psec ON psec.id = p."sectionID"
              LEFT JOIN "PostComment" pc ON pc."postID" = ${postID}
              LEFT JOIN "PostAttachment" pa ON pa."postID" = ${postID}
              LEFT JOIN "Member" m2 ON m2.id = pc."userID"
              LEFT JOIN "PostSubmission" ps ON ps."postID" = p.id AND ps."studentID" = ${this.userID}
              LEFT JOIN "SubmissionAttachment" sa ON sa."postID" = p.id AND sa."studentID" = ${this.userID}
          WHERE p.id = ${postID}
          GROUP BY p.id, m.id, ps."studentID", psec.id, psec.name, ps."submissionStatus", ps.comment, ps."gradeID", ps.timestamp
			`)
		).rows[0];
	}

	async update(postID: number, updatePostDto: UpdateStudentPostDto) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body,
				updated: sql`CURRENT_TIMESTAMP`,
				sectionID: updatePostDto.sectionID
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}
}
