import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import config from '../../core/config';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: config.JWT_SECRET,
			signOptions: { expiresIn: config.JWT_EXPIRATION }
		})
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
