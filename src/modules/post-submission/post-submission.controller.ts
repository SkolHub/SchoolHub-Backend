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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Post submission')
export class PostSubmissionController {
	constructor(private readonly postSubmissionService: PostSubmissionService) {}

	@Get('post/:postID/student/:studentID')
	@ApiOperation({
		description: 'Gets the submission of a student on a post as teacher',
		summary: 'Get submission'
	})
	@UseGuards(TeacherGuard)
	findOne(
		@Param('postID', ParseIntPipe) postID: number,
		@Param('studentID', ParseIntPipe) studentID: number
	) {
		return this.postSubmissionService.findOne(postID, studentID);
	}

	@Get(':postID')
	@ApiOperation({
		description: 'Gets all submissions on a post as teacher',
		summary: 'Get submissions'
	})
	@UseGuards(TeacherGuard)
	findMany(@Param('postID', ParseIntPipe) postID: number) {
		return this.postSubmissionService.findMany(postID);
	}

	@Patch('turn-in/:id')
	@ApiOperation({
		description: 'Turns a submission on a post in as student',
		summary: 'Turn in'
	})
	@UseGuards(StudentGuard)
	turnIn(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.turnIn(id);
	}

	@Patch('un-submit/:id')
	@ApiOperation({
		description:
			'Un-submits a submission on a post as student. The opposite of turn in',
		summary: 'Turn in'
	})
	@UseGuards(StudentGuard)
	unSubmit(@Param('id', ParseIntPipe) id: number) {
		return this.postSubmissionService.unSubmit(id);
	}

	@Patch('redo')
	@ApiOperation({
		description: 'Marks a submission for redo as teacher',
		summary: 'Redo'
	})
	@UseGuards(TeacherGuard)
	redo(@Body() redoSubmissionDto: RedoSubmissionDto) {
		return this.postSubmissionService.redo(redoSubmissionDto);
	}

	@Patch('grade')
	@ApiOperation({
		description: 'Grades a submission as teacher',
		summary: 'Grade'
	})
	@UseGuards(TeacherGuard)
	grade(@Body() gradeSubmissionDto: GradeSubmissionDto) {
		return this.postSubmissionService.grade(gradeSubmissionDto);
	}
}
