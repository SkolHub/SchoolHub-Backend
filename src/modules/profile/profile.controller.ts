import { Controller, Get, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	getAccount() {
		return this.profileService.getAccount();
	}

	@Patch('password')
	update(updatePasswordDto: UpdatePasswordDto) {
		return this.profileService.update(updatePasswordDto);
	}
}
