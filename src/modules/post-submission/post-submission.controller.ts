import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	UseGuards
} from '@nestjs/common';
import { PostSubmissionService } from './post-submission.service';
import { StudentGuard } from '../../shared/guards/student.guard';
import { TeacherGuard } from '../../shared/guards/teacher.guard';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { RedoSubmissionDto } from './dto/redo-submission.dto';

@Controller('post-submission')
export class PostSubmissionController {
	constructor(private readonly postSubmissionService: PostSubmissionService) {}

	@Get('post/:postID/student/:studentID')
	findOne(
		@Param('postID', ParseIntPipe) postID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.postSubmissionService.findOne(postID, studentID);
	}

	@Get(':postID')
	findMany(@Param('postID', ParseIntPipe) postID: number) {
		return this.postSubmissionService.findMany(postID);
	}

	@Patch('turn-in/:id')
	@UseGuards(StudentGuard)
	turnIn(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.turnIn(id);
	}

	@Patch('un-submit/:id')
	@UseGuards(StudentGuard)
	unSubmit(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.unSubmit(id);
	}

	@Patch('redo')
	@UseGuards(TeacherGuard)
	redo(@Body() redoSubmissionDto: RedoSubmissionDto) {
		return this.postSubmissionService.redo(redoSubmissionDto);
	}

	@Patch('grade')
	@UseGuards(TeacherGuard)
	grade(@Body() gradeSubmissionDto: GradeSubmissionDto) {
		return this.postSubmissionService.grade(gradeSubmissionDto);
	}
}
