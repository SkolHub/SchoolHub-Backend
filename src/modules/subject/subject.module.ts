import { Module } from '@nestjs/common';
import { SubjectAdminService } from './admin/subject-admin.service';
import { SubjectAdminController } from './admin/subject-admin.controller';
import { SubjectStudentController } from './student/subject-student.controller';
import { SubjectTeacherController } from './teacher/subject-teacher.controller';
import { SubjectStudentService } from './student/subject-student.service';
import { SubjectTeacherService } from './teacher/subject-teacher.service';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { SubjectParentController } from './parent/subject-parent.controller';
import { SubjectParentService } from './parent/subject-parent.service';

@Module({
	controllers: [
		SubjectStudentController,
		SubjectTeacherController,
		SubjectAdminController,
		SubjectParentController,
		SubjectController
	],
	providers: [
		SubjectStudentService,
		SubjectTeacherService,
		SubjectAdminService,
		SubjectParentService,
		SubjectService
	]
})
export class SubjectModule {}
