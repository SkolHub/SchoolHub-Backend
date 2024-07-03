import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMembersToSubjectDto {
	@IsArray()
	@IsNumber()
	@ApiProperty()
	members: number[];

	@IsNumber()
	@ApiProperty()
	subjectID: number;
}
