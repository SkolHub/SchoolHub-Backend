import {
	IsArray,
	IsInt,
	IsString,
	Length,
	ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ObservationDto {
	@IsString()
	@Length(1, 1000)
	reason: string;

	@IsInt()
	studentID: number;
}

export class CreateObservationsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ObservationDto)
	@ApiProperty({ type: [ObservationDto] })
	observations: {
		reason: string;
		studentID: number;
	}[];

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
