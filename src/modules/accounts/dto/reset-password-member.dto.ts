import { Length, Validate } from 'class-validator';
import { IsPasswordStrong } from '../../../common/constraints/password.constraint';

export class ResetPasswordMemberDto {
	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}
