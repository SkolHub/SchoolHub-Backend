import { IsString, Length } from 'class-validator';

export class UpdateObservationDto {
	@IsString()
	@Length(1, 1000)
	reason: string;
}
