import { IsString, Length } from 'class-validator';

export class UpdateStudentPostDto {
	@IsString()
	@Length(1, 100)
	title: string;

	@IsString()
	@Length(1, 2000)
	body: string;
}
