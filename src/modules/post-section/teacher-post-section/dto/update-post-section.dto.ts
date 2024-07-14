import { IsString, Length } from 'class-validator';

export class UpdatePostSectionDto {
	@IsString()
	@Length(1, 100)
	name: string;
}
