import { IsArray, IsNumber } from 'class-validator';

export class AddMembersToSchoolClassDto {
	@IsArray()
	@IsNumber()
	members: number[];

	@IsNumber()
	schoolClassID: number;
}
