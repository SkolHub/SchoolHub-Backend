import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { DBService } from '../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { postComments } from '../../database/schema/post-comments';

@Injectable()
export class PostCommentService extends DBService {
	async create(createPostCommentDto: CreatePostCommentDto) {
		if (this.role === 'student') {
			await this.db.execute(sql`
                INSERT INTO "PostComment" (body, "userID", "postID")
                SELECT ${createPostCommentDto.body}, ${this.userID}, ${createPostCommentDto.postID}
                WHERE EXISTS (SELECT 1
                              FROM "Post" p
                                       INNER JOIN "StudentToSubject" sts
                                                  ON sts."subjectID" = p."subjectID" AND sts."studentID" = ${this.userID}
                              WHERE p.id = ${createPostCommentDto.postID})

            `);

			return;
		}

		if (this.role === 'teacher') {
			await this.db.execute(sql`
                INSERT INTO "PostComment" (body, "userID", "postID")
                SELECT ${createPostCommentDto.body}, ${this.userID}, ${createPostCommentDto.postID}
                WHERE EXISTS (SELECT 1
                              FROM "Post" p
                                       INNER JOIN "TeacherToSubject" sts
                                                  ON sts."subjectID" = p."subjectID" AND sts."teacherID" = ${this.userID}
                              WHERE p.id = ${createPostCommentDto.postID})

            `);

			return;
		}

		throw new UnauthorizedException(
			'You are neither a teacher nor a student in this subject'
		);
	}

	async update(commentID: number, updatePostCommentDto: UpdatePostCommentDto) {
		await this.db
			.update(postComments)
			.set({
				body: updatePostCommentDto.body,
				updated: sql`CURRENT_TIMESTAMP`
			})
			.where(
				and(
					eq(postComments.id, commentID),
					eq(postComments.userID, this.userID)
				)
			);
	}

	async remove(commentID: number) {
		await this.db
			.delete(postComments)
			.where(
				and(
					eq(postComments.id, commentID),
					eq(postComments.userID, this.userID)
				)
			);
	}
}
