import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;
}
