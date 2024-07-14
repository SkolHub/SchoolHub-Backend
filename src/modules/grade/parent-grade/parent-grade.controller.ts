import { Controller, UseGuards } from '@nestjs/common';
import { ParentGradeService } from './parent-grade.service';
import { ApiTags } from '@nestjs/swagger';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller()
@ApiTags('Parent grades')
@UseGuards(ParentGuard)
export class ParentGradeController {
	constructor(private readonly parentGradeService: ParentGradeService) {}
}
