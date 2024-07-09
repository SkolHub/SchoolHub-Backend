import { Module } from '@nestjs/common';
import { PostSubmissionAttachmentService } from './post-submission-attachment.service';
import { PostSubmissionAttachmentController } from './post-submission-attachment.controller';

@Module({
  controllers: [PostSubmissionAttachmentController],
  providers: [PostSubmissionAttachmentService],
})
export class PostSubmissionAttachmentModule {}
