import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PermissionService } from '../../common/permission.service';

@Module({
	controllers: [PostController],
	providers: [PostService, PermissionService]
})
export class PostModule {}
