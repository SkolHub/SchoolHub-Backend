import { Module } from '@nestjs/common';
import { TeacherGradeService } from './teacher-grade/teacher-grade.service';
import { TeacherGradeController } from './teacher-grade/teacher-grade.controller';
import { PermissionService } from '../../common/permission.service';
import { StudentGradeController } from './student-grade/student-grade.controller';
import { StudentGradeService } from './student-grade/student-grade.service';
import { ParentGradeController } from './parent-grade/parent-grade.controller';
import { ParentGradeService } from './parent-grade/parent-grade.service';

@Module({
	controllers: [
		TeacherGradeController,
		StudentGradeController,
		ParentGradeController
	],
	providers: [
		TeacherGradeService,
		StudentGradeService,
		ParentGradeService,
		PermissionService
	]
})
export class GradeModule {}
