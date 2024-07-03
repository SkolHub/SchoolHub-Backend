import { IsArray, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ExcuseAbsenceDto {
	@IsNumber()
	absenceID: number;

	@IsBoolean()
	excused: boolean;
}

export class ExcuseAbsencesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExcuseAbsenceDto)
	@ApiProperty({ type: [ExcuseAbsenceDto] })
	subjects: {
		absenceID: number;
		excused: boolean;
	}[];
}
