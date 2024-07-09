import { Injectable } from '@nestjs/common';
import { CreatePostAttachmentDto } from './dto/create-post-attachment.dto';
import { UpdatePostAttachmentDto } from './dto/update-post-attachment.dto';

@Injectable()
export class PostAttachmentService {
  create(createPostAttachmentDto: CreatePostAttachmentDto) {
    return 'This action adds a new postAttachment';
  }

  findAll() {
    return `This action returns all postAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postAttachment`;
  }

  update(id: number, updatePostAttachmentDto: UpdatePostAttachmentDto) {
    return `This action updates a #${id} postAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} postAttachment`;
  }
}
