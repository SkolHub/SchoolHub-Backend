import { IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AddObjectsToSchoolClassDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	objects: number[];

	@IsNumber()
	@ApiProperty()
	mainID: number;
}

export class LinkObjectsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AddObjectsToSchoolClassDto)
	@ApiProperty({ type: [AddObjectsToSchoolClassDto] })
	links: {
		objects: number[];
		mainID: number;
	}[];
}
