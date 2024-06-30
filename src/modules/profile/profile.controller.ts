import { Controller, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Patch('password')
	changePassword(changePasswordDto: ChangePasswordDto) {
		this.profileService.changePassword(changePasswordDto);
	}
}
