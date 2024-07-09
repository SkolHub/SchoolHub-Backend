import { IsISO8601, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeacherPostDto {
	@IsString()
	@Length(1, 100)
	@IsOptional()
	@ApiProperty()
	title: string;

	@IsString()
	@Length(1, 2000)
	@IsOptional()
	@ApiProperty()
	body: string;

	@IsISO8601()
	@IsOptional()
	@ApiProperty()
	dueDate: string;
}
