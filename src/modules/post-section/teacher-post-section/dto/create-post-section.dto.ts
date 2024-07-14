import { IsInt, IsString, Length } from 'class-validator';

export class CreatePostSectionDto {
	@IsString()
	@Length(1, 100)
	name: string;

	@IsInt()
	subjectID: number;
}
