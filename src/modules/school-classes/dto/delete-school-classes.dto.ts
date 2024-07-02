import { IsArray, IsInt } from 'class-validator';

export class DeleteSchoolClassesDto {
	@IsArray()
	@IsInt({ each: true })
	schoolClasses: number[];
}
