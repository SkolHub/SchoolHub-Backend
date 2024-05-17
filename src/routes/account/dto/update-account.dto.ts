import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAccountDto {
	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	@Length(1, 100)
	name: string;
}
