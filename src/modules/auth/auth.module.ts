import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthSerializer, LocalStrategy]
})
export class AuthModule {}
