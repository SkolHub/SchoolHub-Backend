import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalOrganizationStrategy extends PassportStrategy(
	Strategy,
	'organization-local'
) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'username',
			passwordField: 'password'
		});
	}

	async validate(
		username: string,
		password: string
	): Promise<{
		userID: number;
		organizationID: number;
		role: 'admin' | 'teacher' | 'student' | 'parent';
	}> {
		return this.authService.validateOrganizationUser(username, password);
	}
}
