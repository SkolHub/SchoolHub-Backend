import { IsInt, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentPostDto {
	@IsString()
	@Length(1, 100)
	@ApiProperty()
	title: string;

	@IsString()
	@Length(1, 2000)
	@ApiProperty()
	body: string;

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
