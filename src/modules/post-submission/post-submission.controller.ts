import {
	Body,
	Controller,
	Param,
	ParseIntPipe,
	Patch,
	UseGuards
} from '@nestjs/common';
import { PostSubmissionService } from './post-submission.service';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { TeacherSubmitDto } from './dto/teacher-submit.dto';

@Controller('post-submission')
export class PostSubmissionController {
	constructor(private readonly postSubmissionService: PostSubmissionService) {}

	@Patch('turn-in/:id')
	@UseGuards(StudentGuard)
	turnIn(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.turnIn(id);
	}

	@Patch('unsubmit/:id')
	@UseGuards(StudentGuard)
	unsubmit(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.unSubmit(id);
	}

	@Patch('redo')
	@UseGuards(TeacherGuard)
	redo(@Body() teacherSubmitDto: TeacherSubmitDto) {
		return this.postSubmissionService.redo(teacherSubmitDto);
	}

	@Patch('grade')
	@UseGuards(TeacherGuard)
	grade(@Body() teacherSubmitDto: TeacherSubmitDto) {
		return this.postSubmissionService.grade(teacherSubmitDto);
	}
}
