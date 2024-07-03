import { IsEmail, IsString, Length } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateAdminDto {
	@IsEmail()
	@ApiProperty()
	user: string;

	@IsString()
	@Length(3, 100)
	@ApiProperty()
	name: string;
}
