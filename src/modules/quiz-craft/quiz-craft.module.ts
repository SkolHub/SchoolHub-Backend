import { Module } from '@nestjs/common';
import { QuizCraftService } from './quiz-craft.service';
import { QuizCraftController } from './quiz-craft.controller';
import {GeminiService} from "../../common/gemini.service";

@Module({
	controllers: [QuizCraftController],
	providers: [QuizCraftService, GeminiService]
})
export class QuizCraftModule {}
