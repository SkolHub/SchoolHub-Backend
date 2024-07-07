import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
import { SchoolClassMemberService } from './school-class-member.service';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';

@Controller()
export class SchoolClassMemberController {
	constructor(
		private readonly schoolClassMemberService: SchoolClassMemberService
	) {}

	@Get('/class-master/:id')
	@UseGuards(TeacherGuard)
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.schoolClassMemberService.findOne(id);
	}
}
