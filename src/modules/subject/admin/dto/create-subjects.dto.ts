import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SubjectDto {
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

export class CreateSubjectsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SubjectDto)
	@ApiProperty({ type: [SubjectDto] })
	subjects: {
		name: string;
		icon: string;
		minGrades: number;
	}[];
}
