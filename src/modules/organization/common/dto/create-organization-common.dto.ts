import {IsEmail, IsString, Length, Validate} from "class-validator";
import {IsPasswordStrong} from "../../../auth/dto/password.constraint";

export class CreateOrganizationCommonDto {
    @IsString()
    @Length(3, 100)
    name: string;

    @IsEmail()
    email: string;

    @Length(8, 100)
    @Validate(IsPasswordStrong)
    password: string;
}
