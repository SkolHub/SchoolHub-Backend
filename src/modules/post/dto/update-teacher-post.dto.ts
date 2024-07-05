import { IsISO8601, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherPostDto {
	@IsString()
	@Length(1, 100)
	title: string;

	@IsString()
	@Length(1, 2000)
	body: string;

	@IsISO8601()
	@ApiProperty()
	dueDate: Date;
}
