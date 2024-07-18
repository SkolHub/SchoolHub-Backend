import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { ParentGradeService } from './parent-grade.service';
import { ApiTags } from '@nestjs/swagger';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller('parent')
@ApiTags('Parent grades')
@UseGuards(ParentGuard)
export class ParentGradeController {
	constructor(private readonly parentGradeService: ParentGradeService) {}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.parentGradeService.findOne(id);
	}
}
