import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import { ParentAbsenceService } from './parent-absence.service';
import { ParentGuard } from '../../../shared/guards/parent.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('parent')
@ApiTags('Parent absences')
@UseGuards(ParentGuard)
export class ParentAbsenceController {
	constructor(private readonly parentAbsenceService: ParentAbsenceService) {}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.parentAbsenceService.findOne(id);
	}
}
