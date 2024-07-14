import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentPostDto {
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

	@IsInt()
	@ApiProperty()
	@IsOptional()
	sectionID: number;
}
