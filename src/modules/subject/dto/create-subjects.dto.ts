import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SubjectDto {
	@IsString()
	@IsNotEmpty()
	name: string;
}

export class CreateSubjectsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SubjectDto)
	subjects: {
		name: string;
	}[];
}
