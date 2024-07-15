import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GradeSubmissionDto {
	@IsInt()
	@ApiProperty()
	postID: number;

	@IsInt()
	@ApiProperty()
	studentID: number;

	@IsString()
	@Length(1, 200)
	@ApiProperty()
	@IsOptional()
	comment: string;

	@IsInt()
	@IsOptional()
	@ApiProperty()
	gradeID: number;
}
