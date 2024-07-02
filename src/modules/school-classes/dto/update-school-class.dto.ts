import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSchoolClassDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name: string;

	@IsNumber()
	@IsOptional()
	classMasterID: number;
}
