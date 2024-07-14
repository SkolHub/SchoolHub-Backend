import { IsArray, IsInt, IsISO8601, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AbsenceDto {
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
		date: string;
		studentID: number;
	}[];

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
