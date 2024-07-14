import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Delete(':id')
	@ApiOperation({
		description:
			'Deletes a post by ID. Only the creator of a post can delete it. This applies to students and teachers',
		summary: 'Delete post'
	})
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postService.remove(id);
	}
}
