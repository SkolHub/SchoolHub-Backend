import {IsPasswordStrong} from "../../../common/constraints/password.constraint";
import {IsEmail, IsString, Length, Validate} from "class-validator";

export class CreateOrganizationDto {
	@IsString()
	@Length(3, 100)
	organizationName: string;

	@IsEmail()
	email: string;

	@IsString()
	@Length(3, 100)
	name: string;

	@Length(8, 100)
	@Validate(IsPasswordStrong)
	password: string;
}