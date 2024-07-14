import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { posts } from '../../database/schema/posts';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostService extends DBService {
	async remove(postID: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, postID), eq(posts.memberID, this.userID)));
	}
}
