import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSchoolClassesDto {
	@IsArray()
	@IsInt({ each: true })
	@ApiProperty()
	schoolClasses: number[];
}
