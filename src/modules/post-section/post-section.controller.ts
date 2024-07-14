import { PostSectionService } from './post-section.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Post section')
export class PostSectionController {
	constructor(private readonly postSectionService: PostSectionService) {}

	@Get(':id')
	@ApiOperation({
		description: 'Gets all the post sections in a subject by ID',
		summary: 'Get post sections'
	})
	findAll(@Param('id') id: string) {
		return this.postSectionService.findAll(+id);
	}
}
