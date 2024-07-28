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

@Controller()
@Public()
export class QuizCraftController {
	constructor(private readonly quizCraftService: QuizCraftService) {}

	@Post()
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
	findAll() {
		return this.quizCraftService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.quizCraftService.findOne(id);
	}

	@Post('verify/:id')
	verify(
		@Param('id', ParseIntPipe) id: number,
		@Body() verifyQuizCraftDto: VerifyQuizCraftDto
	) {
		return this.quizCraftService.verify(id, verifyQuizCraftDto);
	}
}
