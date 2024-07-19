import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { PostSubmissionAttachmentService } from './post-submission-attachment.service';
import { CreatePostSubmissionAttachmentDto } from './dto/create-post-submission-attachment.dto';
import { StudentGuard } from '../../shared/guards/student.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
@UseGuards(StudentGuard)
export class PostSubmissionAttachmentController {
	constructor(
		private readonly postSubmissionAttachmentService: PostSubmissionAttachmentService
	) {}

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
	addFile(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.postSubmissionAttachmentService.addFile(id, file);
	}

	@Post('link/:id')
	addLink(
		@Body()
		createPostSubmissionAttachmentDto: CreatePostSubmissionAttachmentDto,
		@Param('id', ParseIntPipe) id: number
	) {
		this.postSubmissionAttachmentService.addLink(
			createPostSubmissionAttachmentDto,
			id
		);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.postSubmissionAttachmentService.remove(id);
	}
}
