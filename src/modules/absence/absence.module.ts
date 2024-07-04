import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { PermissionService } from '../../common/permission.service';

@Module({
	controllers: [AbsenceController],
	providers: [AbsenceService, PermissionService]
})
export class AbsenceModule {}
