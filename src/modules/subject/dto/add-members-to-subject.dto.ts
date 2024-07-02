import { IsArray, IsNumber } from 'class-validator';

export class AddMembersToSubjectDto {
	@IsArray()
	@IsNumber()
	members: number[];

	@IsNumber()
	subjectID: number;
}
