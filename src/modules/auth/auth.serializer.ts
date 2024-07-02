import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthSerializer extends PassportSerializer {
	constructor() {
		super();
	}

	serializeUser(user: any, done: Function) {
		done(null, user);
	}

	deserializeUser(payload: any, done: Function) {
		done(null, payload);
	}
}
