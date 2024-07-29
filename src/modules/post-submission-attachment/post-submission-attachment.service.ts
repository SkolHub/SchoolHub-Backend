import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { CreatePostSubmissionAttachmentDto } from './dto/create-post-submission-attachment.dto';
import { submissionAttachments } from '../../database/schema/submission-attachments';
import { and, count, eq } from 'drizzle-orm';
import { posts } from '../../database/schema/posts';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';

@Injectable()
export class PostSubmissionAttachmentService extends DBService {
	async isInPostSubject(postID: number) {
		if (
			(
				await this.db
					.select({
						count: count(studentsToSubjects)
					})
					.from(posts)
					.innerJoin(
						studentsToSubjects,
						and(
							eq(studentsToSubjects.subjectID, posts.subjectID),
							eq(studentsToSubjects.studentID, this.userID)
						)
					)
					.where(eq(posts.id, postID))
			)[0].count === 0
		) {
			throw new ForbiddenException('You are not a student in this subject');
		}
	}

	async addFile(postID: number, file: Express.Multer.File) {
		await this.isInPostSubject(postID);

		await this.db.insert(submissionAttachments).values({
			postID,
			studentID: this.userID,
			source: file.filename
		});
	}

	async addLink(
		createPostSubmissionAttachmentDto: CreatePostSubmissionAttachmentDto,
		postID: number
	) {
		await this.isInPostSubject(postID);

		await this.db.insert(submissionAttachments).values({
			postID,
			studentID: this.userID,
			source: createPostSubmissionAttachmentDto.link
		});
	}

	async remove(id: number) {
		await this.db
			.delete(submissionAttachments)
			.where(
				and(
					eq(submissionAttachments.id, id),
					eq(submissionAttachments.studentID, this.userID)
				)
			);
	}
}
