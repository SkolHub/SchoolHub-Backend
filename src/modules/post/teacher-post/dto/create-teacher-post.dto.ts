import {
	IsArray,
	IsIn,
	IsISO8601,
	IsNumberString,
	IsOptional,
	IsString,
	Length
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherPostDto {
	@IsString()
	@Length(1, 100)
	@ApiProperty()
	title: string;

	@IsString()
	@Length(1, 2000)
	@ApiProperty()
	body: string;

	@IsIn(['announcement', 'assignment', 'test', 'material'])
	@ApiProperty()
	type: 'announcement' | 'assignment' | 'test' | 'material';

	@IsNumberString()
	@ApiProperty()
	subjectID: string;

	@IsISO8601()
	@IsOptional()
	@ApiProperty()
	dueDate: string;

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
