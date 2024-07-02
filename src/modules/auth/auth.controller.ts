import { Controller, HttpCode, Post, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@Public()
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	async organizationLogin() {}

	@Post('logout')
	@HttpCode(200)
	async logout(@Session() session: Record<string, any>) {
		session.destroy();
	}
}
