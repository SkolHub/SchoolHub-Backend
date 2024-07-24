import { Controller, Get, UseGuards } from '@nestjs/common';
import { ParentObservationService } from './parent-observation.service';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller()
@ApiTags('Parent observations')
@UseGuards(ParentGuard)
export class ParentObservationController {
	constructor(
		private readonly parentObservationService: ParentObservationService
	) {}

	@Get()
	@ApiOperation({
		description: 'Get all observation of the current student in a subject',
		summary: 'Get observations'
	})
	findAll() {
		return this.parentObservationService.findAll();
	}
}
