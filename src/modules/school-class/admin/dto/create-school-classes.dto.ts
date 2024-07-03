import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SchoolClassDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	classMasterID: number;
}

export class CreateSchoolClassesDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SchoolClassDto)
	@ApiProperty({ type: [SchoolClassDto] })
	schoolClasses: {
		name: string;
		classMasterID?: number;
	}[];
}
