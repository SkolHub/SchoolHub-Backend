import { Controller, UseGuards } from '@nestjs/common';
import { ParentObservationService } from './parent-observation.service';
import { ApiTags } from '@nestjs/swagger';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller()
@ApiTags('Parent observations')
@UseGuards(ParentGuard)
export class ParentObservationController {
	constructor(
		private readonly parentObservationService: ParentObservationService
	) {}
}
