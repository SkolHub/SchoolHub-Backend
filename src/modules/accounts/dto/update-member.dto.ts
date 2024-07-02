import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateMemberDto {
	@IsEmail()
	user: string;

	@IsString()
	@Length(3, 100)
	name: string;
}
