import {
	IsArray,
	IsEmail,
	IsString,
	Length,
	Validate,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPasswordStrong } from '../../../common/constraints/password.constraint';

class MemberDto {
	@IsEmail()
	user: string;

	@IsString()
	@Length(3, 100)
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}

export class AddMembersDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MemberDto)
	members: {
		user: string;
		name: string;
		password: string;
	}[];
}
