import { Module } from '@nestjs/common';
import { SubjectAdminService } from './admin/subject-admin.service';
import { SubjectAdminController } from './admin/subject-admin.controller';

@Module({
  controllers: [SubjectAdminController],
  providers: [SubjectAdminService],
})
export class SubjectModule {}
