import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import env from '../../../core/env';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private authService: AuthService) {
		super({
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: env.GOOGLE_CALLBACK_URL,
			scope: ['email', 'profile']
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: Function
	) {
		// find or create user then call done function with user???
	}
}
