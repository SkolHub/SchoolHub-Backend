import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class SchoolClassDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsOptional()
	classMasterID: number;
}

export class CreateSchoolClassesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SchoolClassDto)
	schoolClasses: {
		name: string;
		classMasterID?: number;
	}[];
}
