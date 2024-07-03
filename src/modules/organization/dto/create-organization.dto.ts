import { IsPasswordStrong } from '../../../common/constraints/password.constraint';
import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
	@IsString()
	@Length(3, 100)
	@ApiProperty()
	organizationName: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@IsString()
	@Length(3, 100)
	@ApiProperty()
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	@ApiProperty()
	password: string;
}
