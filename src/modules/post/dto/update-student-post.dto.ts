import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentPostDto {
	@IsString()
	@Length(1, 100)
	@ApiProperty()
	title: string;

	@IsString()
	@Length(1, 2000)
	@ApiProperty()
	body: string;
}
