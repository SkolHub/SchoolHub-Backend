import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { postSubmissions } from '../../database/schema/post-submissions';
import { and, count, eq, sql } from 'drizzle-orm';
import { posts } from '../../database/schema/posts';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { RedoSubmissionDto } from './dto/redo-submission.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { submissionAttachments } from '../../database/schema/submission-attachments';
import { grades } from '../../database/schema/grades';
import { members } from '../../database/schema/members';

@Injectable()
export class PostSubmissionService extends DBService {
	async findOne(postID: number, studentID: number) {
		return (await this.db
			.select({
				attachments: sql`JSONB_AGG
            (JSONB_BUILD_OBJECT('id', ${submissionAttachments.id}, 'source', ${submissionAttachments.source}))`,
				student: sql`JSONB_BUILD_OBJECT
            ('id', ${members.id}, 'name', ${members.name})`,
				comment: postSubmissions.comment,
				timestamp: postSubmissions.timestamp,
				status: postSubmissions.status,
				grade: sql`JSONB_BUILD_OBJECT
        ('id', ${grades.id}, 'value', ${grades.value}, 'timestamp', ${grades.timestamp}, 'date', ${grades.date}, 'reason', ${grades.reason})`
			})
			.from(posts)
			.innerJoin(
				teachersToSubjects,
				and(
					eq(teachersToSubjects.subjectID, posts.subjectID),
					eq(teachersToSubjects.teacherID, this.userID)
				)
			)
			.innerJoin(members, eq(members.id, studentID))
			.leftJoin(
				postSubmissions,
				and(
					eq(postSubmissions.postID, postID),
					eq(postSubmissions.studentID, studentID)
				)
			)
			.leftJoin(grades, eq(grades.id, postSubmissions.gradeID))
			.innerJoin(
				submissionAttachments,
				and(
					eq(submissionAttachments.postID, postID),
					eq(submissionAttachments.studentID, studentID)
				)
			)
			.where(eq(posts.id, postID))
			.groupBy(
				members.id,
				postSubmissions.postID,
				postSubmissions.comment,
				postSubmissions.timestamp,
				postSubmissions.status,
				grades.id
			))[0];
	}

	findMany(postID: number) {
		return this.db
			.select({
				comment: postSubmissions.comment,
				timestamp: postSubmissions.timestamp,
				status: postSubmissions.status,
				grade: sql`JSONB_BUILD_OBJECT
        ('id', ${grades.id}, 'value', ${grades.value}, 'timestamp', ${grades.timestamp}, 'date', ${grades.date}, 'reason', ${grades.reason})`,
				student: sql`JSONB_BUILD_OBJECT
            ('id', ${members.id}, 'name', ${members.name})`
			})
			.from(posts)
			.innerJoin(
				teachersToSubjects,
				and(
					eq(teachersToSubjects.subjectID, posts.subjectID),
					eq(teachersToSubjects.teacherID, this.userID)
				)
			)
			.innerJoin(postSubmissions, eq(postSubmissions.postID, postID))
			.innerJoin(members, eq(members.id, postSubmissions.studentID))
			.leftJoin(grades, eq(grades.id, postSubmissions.gradeID))
			.where(eq(posts.id, postID));
	}

	async isStudentForPost(postID: number) {
		if (
			(
				await this.db
					.select({
						count: count(studentsToSubjects)
					})
					.from(posts)
					.innerJoin(
						studentsToSubjects,
						eq(studentsToSubjects.subjectID, posts.subjectID)
					)
					.where(eq(posts.id, postID))
			)[0].count === 0
		) {
			throw new ForbiddenException('You are not a student in this subject');
		}
	}

	async turnIn(postID: number) {
		await this.isStudentForPost(postID);

		await this.db
			.insert(postSubmissions)
			.values({
				studentID: this.userID,
				postID: postID,
				status: 'submitted',
				timestamp: new Date()
			})
			.onConflictDoUpdate({
				set: {
					status: 'submitted',
					timestamp: new Date()
				},
				target: [postSubmissions.studentID, postSubmissions.postID]
			});
	}

	async unSubmit(postID: number) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'progress',
				timestamp: null
			})
			.where(
				and(
					eq(postSubmissions.postID, postID),
					eq(postSubmissions.studentID, this.userID)
				)
			);
	}

	async redo(redoSubmissionDto: RedoSubmissionDto) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'redo',
				comment: redoSubmissionDto.comment
			})
			.where(
				and(
					eq(postSubmissions.postID, redoSubmissionDto.postID),
					eq(postSubmissions.studentID, redoSubmissionDto.studentID)
				)
			);
	}

	async grade(gradeSubmissionDto: GradeSubmissionDto) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'graded',
				comment: gradeSubmissionDto.comment,
				gradeID: gradeSubmissionDto.gradeID
			})
			.where(
				and(
					eq(postSubmissions.postID, gradeSubmissionDto.postID),
					eq(postSubmissions.studentID, gradeSubmissionDto.studentID)
				)
			);
	}
}
