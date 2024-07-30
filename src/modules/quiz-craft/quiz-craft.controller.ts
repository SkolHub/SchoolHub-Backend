import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common';
import { QuizCraftService } from './quiz-craft.service';
import { Public } from '../../common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VerifyQuizCraftDto } from './dto/verify-quiz-craft.dto';
import { CreateQuizCraftDto } from './dto/create-quiz-craft.dto';
import { FeedbackQuizCraftDto } from './dto/feedback-quiz-craft.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
@Public()
export class QuizCraftController {
	constructor(private readonly quizCraftService: QuizCraftService) {}

	@Post()
	@ApiOperation({
		description:
			'Creates a QuizCraft quiz from files and question group templates',
		summary: 'Create quiz'
	})
	@UseInterceptors(
		FilesInterceptor('files', 5, {
			storage: diskStorage({
				destination: './uploads',
				filename(_req, file, callback) {
					const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
					callback(null, filename);
				}
			}),
			limits: {
				fileSize: 50_000_000,
				fieldNameSize: 300
			}
		})
	)
	create(
		@Body() createQuizCraftDto: CreateQuizCraftDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		return this.quizCraftService.create(createQuizCraftDto, files);
	}

	@Get()
	@ApiOperation({
		description: 'Gets all QuizCraft quizzes',
		summary: 'Get quizzes'
	})
	findAll() {
		return this.quizCraftService.findAll();
	}

	@Get(':id')
	@ApiOperation({
		description: 'Gets a quiz by ID',
		summary: 'Get quiz'
	})
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.quizCraftService.findOne(id);
	}

	@Post('verify/:id')
	@ApiOperation({
		description: 'Verifies the text responses of a user to a given quiz',
		summary: 'Verify quiz'
	})
	verify(
		@Param('id', ParseIntPipe) id: number,
		@Body() verifyQuizCraftDto: VerifyQuizCraftDto
	) {
		return this.quizCraftService.verify(id, verifyQuizCraftDto);
	}

	@Post('feedback/:id')
	@ApiOperation({
		description:
			'Gives overall feedback about the responses that the user gave and what it should revise',
		summary: 'Feedback quiz'
	})
	feedback(
		@Param('id', ParseIntPipe) id: number,
		@Body() feedbackQuizCraftDto: FeedbackQuizCraftDto
	) {
		return this.quizCraftService.feedback(id, feedbackQuizCraftDto);
	}
}
