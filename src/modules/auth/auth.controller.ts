import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';

@Controller()
export class AuthController {
	@Post('login')
	@Public()
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	async organizationLogin(@Request() req: any) {
		return req.user;
	}

	// @Post('logout')
	// @HttpCode(200)
	// async logout(@Session() session: Record<string, any>) {
	// 	session.destroy();
	// }
}
