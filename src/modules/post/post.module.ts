import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PermissionService } from '../../common/permission.service';
import { StudentPostController } from './student-post/student-post.controller';
import { TeacherPostController } from './teacher-post/teacher-post.controller';
import { StudentPostService } from './student-post/student-post.service';
import { TeacherPostService } from './teacher-post/teacher-post.service';

@Module({
	controllers: [PostController, StudentPostController, TeacherPostController],
	providers: [
		PostService,
		StudentPostService,
		TeacherPostService,
		PermissionService
	]
})
export class PostModule {}
