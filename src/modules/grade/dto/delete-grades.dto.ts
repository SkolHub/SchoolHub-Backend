import { IsArray, IsInt } from 'class-validator';

export class DeleteGradesDto {
	@IsArray()
	@IsInt({ each: true })
	grades: number[];
}
