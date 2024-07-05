import {
	IsArray,
	IsInt,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class GradeDto {
	@IsString()
	@IsOptional()
	@Length(0, 1000)
	@ApiProperty()
	reason: string;

	@IsISO8601()
	@ApiProperty()
	date: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	value: string;

	@IsInt()
	@ApiProperty()
	studentID: number;
}

export class CreateGradesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => GradeDto)
	@ApiProperty({ type: [GradeDto] })
	grades: {
		reason: string;
		date: string;
		value: string;
		studentID: number;
	}[];

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
