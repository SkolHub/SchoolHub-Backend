import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';
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

	@IsNumberString()
	@ApiProperty()
	subjectID: string;

	@IsNumberString()
	@ApiProperty()
	@IsOptional()
	sectionID: string;

	@IsString({ each: true })
	@Length(1, 300)
	@IsOptional()
	@ApiProperty()
	attachments: string;
}
