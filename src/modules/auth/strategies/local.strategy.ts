import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { MemberSession } from '../../../types/session';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'username',
			passwordField: 'password'
		});
	}

	async validate(username: string, password: string): Promise<MemberSession> {
		return this.authService.validateUser(username, password);
	}
}
