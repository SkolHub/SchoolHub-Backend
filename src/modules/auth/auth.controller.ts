import { Controller, HttpCode, Post, Session, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from './local.guard';

@Controller()
export class AuthController {
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
