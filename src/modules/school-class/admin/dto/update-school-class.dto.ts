import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolClassDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	name: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	classMasterID: number;
}
