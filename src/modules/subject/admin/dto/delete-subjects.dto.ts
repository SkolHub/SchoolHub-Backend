import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSubjectsDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	subjects: number[];
}
