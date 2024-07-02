import { IsArray, IsInt } from 'class-validator';

export class DeleteSubjectsDto {
	@IsArray()
	@IsInt({ each: true })
	subjects: number[];
}
