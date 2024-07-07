import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAbsenceDto {
	@IsString()
	@Length(0, 100)
	@ApiProperty()
	reason: string;
}
