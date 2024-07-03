import { Length, Validate } from 'class-validator';
import { IsPasswordStrong } from '../../../common/constraints/password.constraint';
import {ApiProperty} from "@nestjs/swagger";

export class ResetPasswordMemberDto {
	@Length(8, 100)
	@Validate(IsPasswordStrong)
	@ApiProperty()
	password: string;
}
