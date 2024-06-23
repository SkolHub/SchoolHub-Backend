import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import env from '../../../core/env';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor(private authService: AuthService) {
		super({
			clientID: env.FACEBOOK_CLIENT_ID,
			clientSecret: env.FACEBOOK_CLIENT_SECRET,
			callbackURL: env.FACEBOOK_CALLBACK_URL,
			profileFields: ['id', 'emails', 'name']
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
