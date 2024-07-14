import {
	IsArray,
	IsInt,
	IsISO8601,
	IsString,
	Length,
	ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ObservationDto {
	@IsString()
	@Length(1, 1000)
	@ApiProperty()
	reason: string;

	@IsInt()
	@ApiProperty()
	studentID: number;

	@IsISO8601()
	@ApiProperty()
	date: string;
}

export class CreateObservationsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ObservationDto)
	@ApiProperty({ type: [ObservationDto] })
	observations: {
		reason: string;
		studentID: number;
		date: string;
	}[];

	@IsInt()
	@ApiProperty()
	subjectID: number;
}
