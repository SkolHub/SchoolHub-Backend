import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { postSubmissions } from '../../database/schema/post-submissions';
import { and, eq } from 'drizzle-orm';
import { TeacherSubmitDto } from './dto/teacher-submit.dto';

@Injectable()
export class PostSubmissionService extends DBService {
	async turnIn(postID: number) {
		await this.db
			.insert(postSubmissions)
			.values({
				studentID: this.userID,
				postID: postID,
				status: 'submitted'
			})
			.onConflictDoUpdate({
				set: {
					status: 'submitted'
				},
				target: [postSubmissions.studentID, postSubmissions.postID]
			});
	}

	async withold(postID: number) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'progress'
			})
			.where(
				and(
					eq(postSubmissions.postID, postID),
					eq(postSubmissions.studentID, this.userID)
				)
			);
	}

	async redo(teacherSubmitDto: TeacherSubmitDto) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'redo',
				comment: teacherSubmitDto.comment
			})
			.where(
				and(
					eq(postSubmissions.postID, teacherSubmitDto.postID),
					eq(postSubmissions.studentID, teacherSubmitDto.studentID)
				)
			);
	}

	async grade(teacherSubmitDto: TeacherSubmitDto) {
		await this.db
			.update(postSubmissions)
			.set({
				status: 'graded',
				comment: teacherSubmitDto.comment,
				gradeID: teacherSubmitDto.gradeID
			})
			.where(
				and(
					eq(postSubmissions.postID, teacherSubmitDto.postID),
					eq(postSubmissions.studentID, teacherSubmitDto.studentID)
				)
			);
	}
}
