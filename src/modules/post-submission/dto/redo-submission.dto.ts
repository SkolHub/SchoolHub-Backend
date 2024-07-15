import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedoSubmissionDto {
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
}
