import { Module } from '@nestjs/common';
import { SchoolClassAdminService } from './admin/school-class-admin.service';
import { SchoolClassAdminController } from './admin/school-class-admin.controller';

@Module({
  controllers: [SchoolClassAdminController],
  providers: [SchoolClassAdminService],
})
export class SchoolClassModule {}
