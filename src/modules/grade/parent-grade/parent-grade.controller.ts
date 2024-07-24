import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { ParentGradeService } from './parent-grade.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParentGuard } from '../../../shared/guards/parent.guard';

@Controller('parent')
@ApiTags('Parent grades')
@UseGuards(ParentGuard)
export class ParentGradeController {
	constructor(private readonly parentGradeService: ParentGradeService) {}

	@Get(':id')
	@ApiOperation({
		description:
			'Get all grades of the student of the current parent in a subject',
		summary: 'Get subject grades'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.parentGradeService.findOne(id);
	}
}
