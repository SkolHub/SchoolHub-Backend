import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { IsPasswordStrong } from '../../../../common/constraints/password.constraint';

export class CreateAdminDto {
	@IsEmail()
	username: string;

	@IsString()
	@Length(3, 100)
	displayName: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}
