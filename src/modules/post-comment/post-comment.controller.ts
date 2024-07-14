import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('post-comment')
@ApiTags('Post comment')
export class PostCommentController {
	constructor(private readonly postCommentService: PostCommentService) {}

	@Post()
	@ApiOperation({
		description: 'Creates a comment on a post',
		summary: 'Create post comment'
	})
	create(@Body() createPostCommentDto: CreatePostCommentDto) {
		return this.postCommentService.create(createPostCommentDto);
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Updates a post comment by ID',
		summary: 'Update post comment'
	})
	update(
		@Param('id') id: string,
		@Body() updatePostCommentDto: UpdatePostCommentDto
	) {
		return this.postCommentService.update(+id, updatePostCommentDto);
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Deletes a post comment by ID',
		summary: 'Delete post comment'
	})
	remove(@Param('id') id: string) {
		return this.postCommentService.remove(+id);
	}
}
