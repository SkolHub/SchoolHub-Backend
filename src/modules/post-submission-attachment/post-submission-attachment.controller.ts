import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostSubmissionAttachmentService } from './post-submission-attachment.service';
import { CreatePostSubmissionAttachmentDto } from './dto/create-post-submission-attachment.dto';
import { UpdatePostSubmissionAttachmentDto } from './dto/update-post-submission-attachment.dto';

@Controller('post-submission-attachment')
export class PostSubmissionAttachmentController {
  constructor(private readonly postSubmissionAttachmentService: PostSubmissionAttachmentService) {}

  @Post()
  create(@Body() createPostSubmissionAttachmentDto: CreatePostSubmissionAttachmentDto) {
    return this.postSubmissionAttachmentService.create(createPostSubmissionAttachmentDto);
  }

  @Get()
  findAll() {
    return this.postSubmissionAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postSubmissionAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostSubmissionAttachmentDto: UpdatePostSubmissionAttachmentDto) {
    return this.postSubmissionAttachmentService.update(+id, updatePostSubmissionAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postSubmissionAttachmentService.remove(+id);
  }
}
