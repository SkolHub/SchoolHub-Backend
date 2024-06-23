import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import env from './core/env';
import * as passport from 'passport';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(
		session({
			secret: env.COOKIE_SECRET,
			resave: false,
			saveUninitialized: false
		})
	);
	app.useGlobalPipes(new ValidationPipe());
	app.use(passport.initialize());
	app.use(passport.session());

	await app.listen(3000);
}

void bootstrap();
