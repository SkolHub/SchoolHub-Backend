import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import config from './core/env';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from './routes/auth/auth.module';
import { OrganizationModule } from './routes/organization/organization.module';
import { SchoolClassModule } from './routes/school-class/school-class.module';
import { SubjectModule } from './routes/subject/subject.module';
import * as schema from './core/schema';
import { PassportModule } from '@nestjs/passport';
import { AuthenticatedGuard } from './routes/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
		AuthModule,
		OrganizationModule,
		SchoolClassModule,
		SubjectModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthenticatedGuard
		}
	]
})
export class AppModule {}
