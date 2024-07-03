import { IsPasswordStrong } from '../../../common/constraints/password.constraint';
import { Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
	@Length(8, 100)
	@Validate(IsPasswordStrong)
	@ApiProperty()
	password: string;
}
