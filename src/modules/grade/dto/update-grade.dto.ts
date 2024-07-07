import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
	@IsString()
	@Length(0, 100)
	@ApiProperty()
	reason: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	value: string;
}
