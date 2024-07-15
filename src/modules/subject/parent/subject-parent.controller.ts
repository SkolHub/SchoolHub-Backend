import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubjectParentService } from './subject-parent.service';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller('parent')
@UseGuards(ParentGuard)
export class SubjectParentController {
	constructor(private readonly subjectParentService: SubjectParentService) {}

	@Get()
	findMany() {
		return this.subjectParentService.findMany();
	}
}
