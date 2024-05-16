import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 50)
    password: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    name: string;
}
