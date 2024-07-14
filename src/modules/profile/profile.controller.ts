import { Controller, Get, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	@ApiOperation({
		description:
			'Gets the account of the current user. Includes the name, the role and the username',
		summary: 'Get account'
	})
	getAccount() {
		return this.profileService.getAccount();
	}

	@Patch('password')
	@ApiOperation({
		description: 'Resets the password of the current user',
		summary: 'Reset password'
	})
	update(updatePasswordDto: UpdatePasswordDto) {
		return this.profileService.update(updatePasswordDto);
	}
}
