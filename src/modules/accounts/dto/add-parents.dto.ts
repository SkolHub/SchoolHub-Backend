import {
	IsArray,
	IsEmail,
	IsInt,
	IsString,
	Length,
	Validate,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPasswordStrong } from '../../../common/constraints/password.constraint';

class ParentDto {
	@IsEmail()
	user: string;

	@IsString()
	@Length(3, 100)
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;

	@IsInt()
	studentID: number;
}

export class AddParentsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ParentDto)
	members: {
		user: string;
		name: string;
		password: string;
		studentID: number;
	}[];
}
