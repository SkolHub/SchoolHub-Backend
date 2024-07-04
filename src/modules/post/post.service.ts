import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DBService } from '../../common/db.service';
import { PermissionService } from '../../common/permission.service';
import { posts } from '../../database/schema/posts';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createPostDto: CreatePostDto, teacherID: number) {
		const isTeacher = this.permissionService.isTeacherInSubject(
			teacherID,
			createPostDto.subjectID
		);

		if (!isTeacher) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		await this.db.insert(posts).values({
			subjectID: createPostDto.subjectID,
			body: createPostDto.body,
			memberID: teacherID,
			title: createPostDto.title,
			type: createPostDto.type
		});
	}

	async update(
		postID: number,
		updatePostDto: UpdatePostDto,
		teacherID: number
	) {
		await this.db
			.update(posts)
			.set({
				title: updatePostDto.title,
				body: updatePostDto.body,
				type: updatePostDto.type
			})
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}

	async remove(postID: number, teacherID: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, postID), eq(posts.memberID, teacherID)));
	}
}
