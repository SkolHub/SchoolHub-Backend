import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';

class TaggedDto {
	@IsString()
	@IsNotEmpty()
	user: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	tags: string[];
}

export class GenerateAccountsDto {
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TaggedDto)
	students: {
		user: string;
		password: string;
		name: string;
		tags: string[];
	}[];

	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => TaggedDto)
	teachers: {
		user: string;
		password: string;
		name: string;
		tags: string[];
	}[];
}
