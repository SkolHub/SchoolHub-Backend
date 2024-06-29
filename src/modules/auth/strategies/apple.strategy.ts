import { Strategy } from 'passport-apple';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import env from '../../../config/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
	constructor(private authService: AuthService) {
		super({
			clientID: env.APPLE_CLIENT_ID,
			teamID: env.APPLE_TEAM_ID,
			callbackURL: env.APPLE_CALLBACK_URL,
			keyID: env.APPLE_KEY_ID,
			privateKeyLocation: env.APPLE_PRIVATE_KEYFILE_PATH
		});
	}

	async validate(
		idToken: string,
		accessToken: string,
		profile: any,
		done: Function
	) {
		// find or create user then call done function with user???
	}
}
