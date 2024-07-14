import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

/*
    The local strategy; Validates the user credentials and returns a JWT token if successful;
    Used in combination with the local auth guard
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'user',
			passwordField: 'password'
		});
	}

	async validate(
		user: string,
		password: string
	): Promise<{
		token: string;
	}> {
		return this.authService.validateUser(user, password);
	}
}
