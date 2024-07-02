import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateAdminDto {
	@IsEmail()
	user: string;

	@IsString()
	@Length(3, 100)
	name: string;
}
