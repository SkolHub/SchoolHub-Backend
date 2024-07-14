import { Module } from '@nestjs/common';
import { PermissionService } from '../../common/permission.service';
import { TeacherAbsenceController } from './teacher-absence/teacher-absence.controller';
import { TeacherAbsenceService } from './teacher-absence/teacher-absence.service';
import { StudentAbsenceController } from './student-absence/student-absence.controller';
import { StudentAbsenceService } from './student-absence/student-absence.service';
import { ParentAbsenceController } from './parent-absence/parent-absence.controller';
import { ParentAbsenceService } from './parent-absence/parent-absence.service';

@Module({
	controllers: [
		TeacherAbsenceController,
		StudentAbsenceController,
		ParentAbsenceController
	],
	providers: [
		TeacherAbsenceService,
		StudentAbsenceService,
		ParentAbsenceService,
		PermissionService
	]
})
export class AbsenceModule {}
