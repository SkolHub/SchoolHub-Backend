import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { AuthModule } from './routes/auth/auth.module';
import config from './core/config';
import { ClsModule } from 'nestjs-cls';
import * as schema from './core/schema';
import { AuthGuard } from './routes/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		AuthModule,
		DrizzlePGModule.register({
			tag: 'DB',
			config: { schema: { ...schema } },
			pg: {
				connection: 'client',
				config: {
					connectionString: config.DB_URL
				}
			}
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true
			}
		})
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
