import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizCraftDto {
	@ApiProperty()
	@IsString()
	groups: string;
}
