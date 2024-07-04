import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { PermissionService } from '../../common/permission.service';

@Module({
	controllers: [GradeController],
	providers: [GradeService, PermissionService]
})
export class GradeModule {}
