import {
	IsArray,
	IsNotEmpty,
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

	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	tags: string[];
}

export class AddTaggedAccountsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AccountDto)
	accounts: {
		username: string;
		password: string;
		displayName: string;
		tags: string[];
	}[];
}
