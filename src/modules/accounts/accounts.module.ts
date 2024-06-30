import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AdminModule } from './owner/admin/admin.module';
import { StudentModule } from './admin/student/student.module';
import { TeacherModule } from './admin/teacher/teacher.module';
import { ParentModule } from './admin/parent/parent.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [AdminModule, StudentModule, TeacherModule, ParentModule],
})
export class AccountsModule {}
