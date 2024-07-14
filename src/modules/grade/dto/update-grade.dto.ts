import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGradeDto {
	@IsString()
	@Length(1, 100)
	@IsOptional()
	@ApiProperty()
	reason: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	value: string;
}
