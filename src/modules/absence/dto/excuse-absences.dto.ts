import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ExcuseAbsenceDto {
	@IsNumber()
	@ApiProperty()
	absenceID: number;
}

export class ExcuseAbsencesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExcuseAbsenceDto)
	@ApiProperty({ type: [ExcuseAbsenceDto] })
	subjects: {
		absenceID: number;
	}[];
}
