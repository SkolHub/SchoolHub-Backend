export class GenerateAccountsDto {
	users: {
		user: string;
		password: string;
		name: string;
		tags: string[];
	}[];
}
