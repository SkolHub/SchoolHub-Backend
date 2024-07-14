import { Module } from '@nestjs/common';
import { TeacherPostSectionService } from './teacher-post-section/teacher-post-section.service';
import { TeacherPostSectionController } from './teacher-post-section/teacher-post-section.controller';
import { PostSectionController } from './post-section.controller';
import { PostSectionService } from './post-section.service';

@Module({
	controllers: [TeacherPostSectionController, PostSectionController],
	providers: [TeacherPostSectionService, PostSectionService]
})
export class PostSectionModule {}
