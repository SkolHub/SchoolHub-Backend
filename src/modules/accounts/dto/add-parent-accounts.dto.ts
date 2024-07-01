import {
	IsArray,
	IsInt,
	IsString,
	Length,
	Validate,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPasswordStrong } from '../../../common/constraints/password.constraint';

class AccountDto {
	@IsString()
	@Length(3, 100)
	username: string;

	@IsString()
	@Length(3, 100)
	displayName: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;

	@IsInt()
	studentID: number;
}

export class AddParentAccountsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AccountDto)
	accounts: {
		username: string;
		password: string;
		displayName: string;
		studentID: number;
	}[];
}
