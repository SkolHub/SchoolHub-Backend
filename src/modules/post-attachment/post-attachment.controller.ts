import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostAttachmentService } from './post-attachment.service';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';

@Controller('post-attachment')
export class PostAttachmentController {
  constructor(private readonly postAttachmentService: PostAttachmentService) {}

  @Post()
  create(@Body() createPostAttachmentDto: CreatePostAttachmentDto) {
    return this.postAttachmentService.create(createPostAttachmentDto);
  }

  @Get()
  findAll() {
    return this.postAttachmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postAttachmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostAttachmentDto: UpdatePostAttachmentDto) {
    return this.postAttachmentService.update(+id, updatePostAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postAttachmentService.remove(+id);
  }
}
