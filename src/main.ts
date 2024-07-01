import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import env from './config/config';
import * as passport from 'passport';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const redisClient = createClient();
	redisClient.connect().catch(console.error);

	const redisStore = new RedisStore({
		client: redisClient,
		prefix: 'schoolhub:'
	});

	app.use(
		session({
			store: redisStore,
			secret: env.COOKIE_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: false
			}
		})
	);
	app.useGlobalPipes(new ValidationPipe());
	app.use(passport.initialize());
	app.use(passport.session());

	const config = new DocumentBuilder()
		.setTitle('Cats example')
		.setDescription('The cats API description')
		.setVersion('1.0')
		.addTag('cats')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(8000);
}

void bootstrap();
