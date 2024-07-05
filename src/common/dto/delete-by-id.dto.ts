import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteByIdDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	objects: number[];
}
