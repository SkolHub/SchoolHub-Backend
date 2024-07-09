import { Module } from '@nestjs/common';
import { PostSectionService } from './post-section.service';
import { PostSectionController } from './post-section.controller';

@Module({
  controllers: [PostSectionController],
  providers: [PostSectionService],
})
export class PostSectionModule {}
