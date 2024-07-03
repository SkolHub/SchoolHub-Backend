import { IsString, Length } from 'class-validator';

export class UpdateAbsenceDto {
	@IsString()
	@Length(0, 1000)
	reason: string;
}
