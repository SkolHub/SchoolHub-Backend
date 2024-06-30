import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { UserDto } from './generate-accounts.dto';

class TaggedUserDto extends UserDto {
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	tags: string[];
}

export class GenerateTaggedAccountsDto {
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TaggedUserDto)
	accounts: {
		username: string;
		password: string;
		name: string;
		tags: string[];
	}[];
}
