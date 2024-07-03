import { IsInt, IsString, Length } from 'class-validator';

export class CreateObservationsDto {
	@IsString()
	@Length(1, 1000)
	reason: string;

	@IsInt()
	studentID: number;

	@IsInt()
	subjectID: number;
}
