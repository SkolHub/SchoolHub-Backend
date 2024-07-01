import { IsArray, IsInt } from 'class-validator';

export class DeleteAccountsDto {
	@IsArray()
	@IsInt({ each: true })
	accounts: number[];
}
