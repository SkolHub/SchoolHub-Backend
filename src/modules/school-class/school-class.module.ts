import { Module } from '@nestjs/common';
import { SchoolClassAdminService } from './admin/school-class-admin.service';
import { SchoolClassAdminController } from './admin/school-class-admin.controller';
import { SchoolClassClassMasterController } from './class-master/school-class-class-master.controller';
import { SchoolClassClassMasterService } from './class-master/school-class-class-master.service';

@Module({
	controllers: [SchoolClassAdminController, SchoolClassClassMasterController],
	providers: [SchoolClassAdminService, SchoolClassClassMasterService]
})
export class SchoolClassModule {}
