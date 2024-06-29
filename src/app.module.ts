import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import config from './config/config';
import { ClsModule } from 'nestjs-cls';
import * as schema from './database/schema';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthenticatedGuard } from './shared/guards/auth.guard';

@Module({
	imports: [
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
		}),
		PassportModule.register({
			session: true
		}),
		RouterModule.register([
			{
				path: 'auth',
				module: AuthModule
			},
			{
				path: 'organization',
				module: OrganizationModule
			}
		]),
		AuthModule,
		OrganizationModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthenticatedGuard
		}
	]
})
export class AppModule {}
