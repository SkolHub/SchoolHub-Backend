import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { PostAttachmentService } from './post-attachment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('post-attachment')
@ApiTags('Post attachment')
export class PostAttachmentController {
	constructor(private readonly postAttachmentService: PostAttachmentService) {}

	@Post('file/:id')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename(_req, file, callback) {
					const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
					callback(null, filename);
				}
			}),
			limits: {
				fileSize: 50_000_000,
				fieldNameSize: 300
			}
		})
	)
	@ApiOperation({
		description: 'Adds a file attachment to a post',
		summary: 'Add file attachment'
	})
	addFile(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.postAttachmentService.addFile(id, file);
	}

	@Post('link/:id')
	@ApiOperation({
		description: 'Adds a link attachment to a post',
		summary: 'Add file attachment'
	})
	addLink(
		@Body() createPostAttachmentDto: CreatePostAttachmentDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.postAttachmentService.addLink(createPostAttachmentDto, id);
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Deletes a post attachment by ID',
		summary: 'Delete attachment'
	})
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.postAttachmentService.remove(id);
	}
}
