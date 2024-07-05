import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/config';

@Module({
	imports: [
		JwtModule.register({
			secret: config.JWT_SECRET
		})
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
