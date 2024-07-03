import { IsArray, IsInt } from 'class-validator';

export class DeleteByIdDto {
	@IsArray()
	@IsInt({ each: true })
	objects: number[];
}
