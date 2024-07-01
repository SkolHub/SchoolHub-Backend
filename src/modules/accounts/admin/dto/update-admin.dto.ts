import { IsString, Length } from 'class-validator';

export class UpdateAdminDto {
	@IsString()
	@Length(3, 100)
	displayName: string;
}
