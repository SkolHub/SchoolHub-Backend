import { Controller, Get, Patch, Session } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RawMemberSession } from '../../types/session';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	getAccount(@Session() session: RawMemberSession) {
		return this.profileService.getAccount(session.passport.user.userID);
	}

	@Patch('password')
	update(
		updatePasswordDto: UpdatePasswordDto,
		@Session() session: RawMemberSession
	) {
		return this.profileService.update(
			updatePasswordDto,
			session.passport.user.userID
		);
	}
}
