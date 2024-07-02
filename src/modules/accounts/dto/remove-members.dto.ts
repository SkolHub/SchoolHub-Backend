import { IsArray, IsInt } from 'class-validator';

export class RemoveMembersDto {
	@IsArray()
	@IsInt({ each: true })
	members: number[];
}
