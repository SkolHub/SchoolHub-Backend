import { IsEmail, Length, Validate } from 'class-validator';
import { IsPasswordStrong } from './password.constraint';

export class AuthDto {
	@IsEmail()
	email: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}
