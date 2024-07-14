import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from '../../../config/config';
import { ClsService } from 'nestjs-cls';

/*
    The JWT strategy; Validates the JWT token based on the JWT_SECRET in the .env file. Grants permission if successful;
   	Also sets the users userID, organizationID, role and studentID in the cls storage for easy access
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly cls: ClsService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.JWT_SECRET
		});
	}

	async validate(payload: any) {
		this.cls.set('userID', payload.userID);
		this.cls.set('organizationID', payload.organizationID);
		this.cls.set('role', payload.role);
		this.cls.set('studentID', payload.studentID);

		return true;
	}
}
