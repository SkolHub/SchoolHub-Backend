import {
	Body,
	Controller,
	Get,
	Post,
	Redirect,
	Session,
	UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { FacebookAuthGuard } from './guards/facebook.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { AppleAuthGuard } from './guards/apple.guard';
import env from '../../core/env';
import { AuthDto } from './dto/auth.dto';
import { Public } from '../../core/public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login/global')
	@Public()
	@UseGuards(LocalAuthGuard)
	async login(@Session() session: Record<string, any>) {
		console.log(session);
	}

	@Post('register')
	@Public()
	async register(@Body() authDto: AuthDto) {
		return this.authService.create(authDto);
	}

	@Get('facebook')
	@Public()
	@UseGuards(FacebookAuthGuard)
	async facebookLogin() {}

	@Get('facebook/callback')
	@Public()
	@UseGuards(FacebookAuthGuard)
	@Redirect(env.HOME_URL, 303)
	async facebookLoginCallback() {}

	@Get('google')
	@Public()
	@UseGuards(GoogleAuthGuard)
	async googleLogin() {}

	@Get('google/callback')
	@Public()
	@UseGuards(GoogleAuthGuard)
	@Redirect(env.HOME_URL, 303)
	async googleLoginCallback() {}

	@Get('apple')
	@Public()
	@UseGuards(AppleAuthGuard)
	async appleLogin() {}

	@Get('apple/callback')
	@Public()
	@UseGuards(AppleAuthGuard)
	@Redirect(env.HOME_URL, 303)
	async appleLoginCallback() {}

	@Post('logout')
	async logout(@Session() session: Record<string, any>) {
		session.destroy();
	}
}
