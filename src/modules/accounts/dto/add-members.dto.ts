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
import { ApiProperty } from '@nestjs/swagger';

class MemberDto {
	@IsEmail()
	@ApiProperty()
	user: string;

	@IsString()
	@Length(3, 100)
	@ApiProperty()
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	@ApiProperty()
	password: string;
}

export class AddMembersDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => MemberDto)
	@ApiProperty({ type: [MemberDto] })
	members: {
		user: string;
		name: string;
		password: string;
	}[];
}
