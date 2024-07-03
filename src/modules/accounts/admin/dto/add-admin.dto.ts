import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { IsPasswordStrong } from '../../../../common/constraints/password.constraint';
import { ApiProperty } from '@nestjs/swagger';

export class AddAdminDto {
	@IsEmail()
	@ApiProperty()
	user: string;

	@IsString()
	@Length(3, 100)
	@ApiProperty()
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	@ApiProperty()
	password: string;
}
