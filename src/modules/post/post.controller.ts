import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Session
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RawMemberSession } from '../../types/session';

@Controller()
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(
		@Body() createPostDto: CreatePostDto,
		@Session() session: RawMemberSession
	) {
		return this.postService.create(createPostDto, session.passport.user.userID);
	}

	@Patch(':id')
	update(
		@Body() updatePostDto: UpdatePostDto,
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.update(
			id,
			updatePostDto,
			session.passport.user.userID
		);
	}

	@Delete(':id')
	remove(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: RawMemberSession
	) {
		return this.postService.remove(id, session.passport.user.userID);
	}
}
