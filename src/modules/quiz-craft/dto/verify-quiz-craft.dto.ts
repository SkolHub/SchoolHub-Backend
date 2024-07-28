import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyQuestionDto {
	@IsString()
	question: string;

	@IsString()
	answer: string;
}

export class VerifyQuizCraftDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VerifyQuestionDto)
	@ApiProperty({ type: [VerifyQuestionDto] })
	questions: {
		question: string;
		answer: string;
	}[];
}
