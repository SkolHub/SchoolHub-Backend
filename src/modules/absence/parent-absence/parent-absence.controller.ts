import { Controller, UseGuards } from '@nestjs/common';
import { ParentAbsenceService } from './parent-absence.service';
import { ParentGuard } from '../../../shared/guards/parent.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Parent absences')
@UseGuards(ParentGuard)
export class ParentAbsenceController {
	constructor(private readonly parentAbsenceService: ParentAbsenceService) {}
}
