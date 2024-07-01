import { Body, Controller, Get, Patch, Session } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RawMemberSession } from '../../types/session';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	account(@Session() session: RawMemberSession) {
		return this.profileService.account(session.passport.user.userID);
	}

	@Patch('password')
	changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@Session() session: RawMemberSession
	) {
		return this.profileService.changePassword(
			changePasswordDto,
			session.passport.user.userID
		);
	}
}
