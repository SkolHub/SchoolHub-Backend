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
import { ApiProperty } from '@nestjs/swagger';

class ParentDto {
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

	@IsInt()
	@ApiProperty()
	studentID: number;
}

export class AddParentsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ParentDto)
	@ApiProperty({ type: [ParentDto] })
	members: {
		user: string;
		name: string;
		password: string;
		studentID: number;
	}[];
}
