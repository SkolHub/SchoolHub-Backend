import { Module } from '@nestjs/common';
import { PostAttachmentService } from './post-attachment.service';
import { PostAttachmentController } from './post-attachment.controller';

@Module({
  controllers: [PostAttachmentController],
  providers: [PostAttachmentService],
})
export class PostAttachmentModule {}
