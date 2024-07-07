import { IsArray, IsInt, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExcuseAbsencesDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	absences: number[];

	@IsString()
	@Length(0, 100)
	reason: string;
}
