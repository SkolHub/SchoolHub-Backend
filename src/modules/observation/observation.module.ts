import { Module } from '@nestjs/common';
import { TeacherObservationService } from './teacher-observation/teacher-observation.service';
import { TeacherObservationController } from './teacher-observation/teacher-observation.controller';
import { PermissionService } from '../../common/permission.service';
import { ParentObservationController } from './parent-observation/parent-observation.controller';
import { ParentObservationService } from './parent-observation/parent-observation.service';

@Module({
	controllers: [TeacherObservationController, ParentObservationController],
	providers: [
		TeacherObservationService,
		ParentObservationService,
		PermissionService
	]
})
export class ObservationModule {}
