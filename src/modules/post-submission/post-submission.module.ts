import { Module } from '@nestjs/common';
import { PostSubmissionService } from './post-submission.service';
import { PostSubmissionController } from './post-submission.controller';

@Module({
  controllers: [PostSubmissionController],
  providers: [PostSubmissionService],
})
export class PostSubmissionModule {}
