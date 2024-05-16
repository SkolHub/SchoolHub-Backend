import {
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Database } from '../../core/types';
import { users } from '../../schema/users';
import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@Inject('DB') private db: Database,
		private jwtService: JwtService
	) {}

	async login(loginDto: LoginDto) {
		const user = await this.db.query.users.findFirst({
			where: eq(users.email, loginDto.email)
		});

		if (!user || !(await compare(loginDto.password, user.password))) {
			throw new UnauthorizedException();
		}

		return {
			access_token: await this.jwtService.signAsync({
				id: user.id,
				username: user.email
			})
		};
	}

	async register(registerDto: RegisterDto) {
		try {
			this.db.insert(users).values({
				email: registerDto.email,
				password: await hash(registerDto.password, 10)
			});
		} catch (e) {
			if (e.code === '23505') {
				throw new ConflictException(e.detail);
			}
		}
	}
}
