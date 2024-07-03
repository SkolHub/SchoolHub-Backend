import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveMembersDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	members: number[];
}
