import { Injectable } from '@nestjs/common';
import { CreatePostSubmissionAttachmentDto } from './dto/create-post-submission-attachment.dto';
import { UpdatePostSubmissionAttachmentDto } from './dto/update-post-submission-attachment.dto';

@Injectable()
export class PostSubmissionAttachmentService {
  create(createPostSubmissionAttachmentDto: CreatePostSubmissionAttachmentDto) {
    return 'This action adds a new postSubmissionAttachment';
  }

  findAll() {
    return `This action returns all postSubmissionAttachment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postSubmissionAttachment`;
  }

  update(id: number, updatePostSubmissionAttachmentDto: UpdatePostSubmissionAttachmentDto) {
    return `This action updates a #${id} postSubmissionAttachment`;
  }

  remove(id: number) {
    return `This action removes a #${id} postSubmissionAttachment`;
  }
}
