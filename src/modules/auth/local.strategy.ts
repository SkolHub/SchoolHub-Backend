import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MemberSession } from '../../types/session';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'user',
			passwordField: 'password'
		});
	}

	async validate(user: string, password: string): Promise<MemberSession> {
		return this.authService.validateUser(user, password);
	}
}
