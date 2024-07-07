import {
	IsArray,
	IsInt,
	IsISO8601,
	IsOptional,
	IsString,
	Length,
	ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AbsenceDto {
	@IsString()
	@IsOptional()
	@Length(0, 100)
	@ApiProperty()
	reason: string;

	@IsISO8601()
	@ApiProperty()
	date: string;

	@IsInt()
	@ApiProperty()
	studentID: number;
}

export class CreateAbsencesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AbsenceDto)
	@ApiProperty({ type: [AbsenceDto] })
	absences: {
		reason: string;
		date: string;
		studentID: number;
	}[];

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
