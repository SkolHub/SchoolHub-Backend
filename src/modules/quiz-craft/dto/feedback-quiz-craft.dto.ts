import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackQuizCraftDto {
	@IsString()
	@IsNotEmpty()
	responses: string;
}
