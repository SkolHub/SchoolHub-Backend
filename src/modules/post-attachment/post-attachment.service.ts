import {
	BadRequestException,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { count, eq } from 'drizzle-orm';
import { postAttachments } from '../../database/schema/post-attachments';
import { posts } from '../../database/schema/posts';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';

@Injectable()
export class PostAttachmentService extends DBService {
	async isOverFileCount(postID: number) {
		if (
			(
				await this.db
					.select({
						count: count()
					})
					.from(postAttachments)
					.where(eq(postAttachments.postID, postID))
			)[0].count >= 10
		) {
			throw new BadRequestException('You can only upload up to 10 attachments');
		}
	}

	async isPostCreator(postID: number) {
		if (
			(
				await this.db
					.select({
						memberID: posts.memberID
					})
					.from(posts)
					.where(eq(posts.id, postID))
			)[0].memberID !== this.userID
		) {
			throw new ForbiddenException('You did not create this post');
		}
	}

	async isAttachmentCreator(attachmentID: number) {
		if (
			(
				await this.db
					.select({
						memberID: posts.memberID
					})
					.from(postAttachments)
					.innerJoin(posts, eq(posts.id, postAttachments.postID))
					.where(eq(postAttachments.id, attachmentID))
					.limit(1)
			)[0].memberID !== this.userID
		) {
			throw new ForbiddenException('You did not create this post');
		}
	}

	async addFile(postID: number, files: Express.Multer.File) {
		await this.isPostCreator(postID);
		await this.isOverFileCount(postID);

		await this.db.insert(postAttachments).values({
			postID,
			source: files.filename
		});
	}

	async addLink(
		createPostAttachmentDto: CreatePostAttachmentDto,
		postID: number
	) {
		await this.isPostCreator(postID);
		await this.isOverFileCount(postID);

		await this.db.insert(postAttachments).values({
			postID,
			source: createPostAttachmentDto.link
		});
	}

	async remove(attachmentID: number) {
		await this.isAttachmentCreator(attachmentID);

		await this.db
			.delete(postAttachments)
			.where(eq(postAttachments.id, attachmentID));
	}
}
