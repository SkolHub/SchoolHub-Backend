import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppleStrategy } from './strategies/apple.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthSerializer } from './utils/auth.serializer';

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [
		AuthService,
		AppleStrategy,
		FacebookStrategy,
		GoogleStrategy,
		LocalStrategy,
		AuthSerializer
	]
})
export class AuthModule {}
