import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExcuseAbsencesDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	absences: number[];
}
