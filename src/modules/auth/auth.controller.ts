import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Auth')
export class AuthController {
	@Post('login')
	@Public()
	@UseGuards(LocalAuthGuard)
	@HttpCode(200)
	@ApiOperation({
		description:
			'Performs authentication and returns a JWT token if successful',
		summary: 'Login'
	})
	async organizationLogin(@Request() req: any) {
		return req.user;
	}
}
