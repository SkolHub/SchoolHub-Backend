import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	icon: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	minGrades: number;
}
