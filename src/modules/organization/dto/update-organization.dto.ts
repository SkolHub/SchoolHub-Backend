import { IsString, Length } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateOrganizationDto {
	@IsString()
	@Length(3, 100)
	@ApiProperty()
	name: string;
}
