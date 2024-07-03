import { IsArray, IsInt } from 'class-validator';

export class DeleteAbsencesDto {
	@IsArray()
	@IsInt({ each: true })
	absences: number[];
}
