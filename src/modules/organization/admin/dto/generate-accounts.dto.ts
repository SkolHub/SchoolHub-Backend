import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
	@IsString()
	@IsNotEmpty()
	user: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}

export class GenerateAccountsDto {
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => UserDto)
	accounts: {
		username: string;
		password: string;
		name: string;
	}[];
}
