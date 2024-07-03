import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMembersToSchoolClassDto {
	@IsArray()
	@IsNumber()
	@ApiProperty()
	members: number[];

	@IsNumber()
	@ApiProperty()
	schoolClassID: number;
}
