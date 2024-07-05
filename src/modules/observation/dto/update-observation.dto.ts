import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateObservationDto {
	@IsString()
	@Length(1, 1000)
	@ApiProperty()
	reason: string;
}
