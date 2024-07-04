import { Module } from '@nestjs/common';
import { ObservationService } from './observation.service';
import { ObservationController } from './observation.controller';
import { PermissionService } from '../../common/permission.service';

@Module({
	controllers: [ObservationController],
	providers: [ObservationService, PermissionService]
})
export class ObservationModule {}
