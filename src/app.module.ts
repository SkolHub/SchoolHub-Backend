import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { AuthModule } from './routes/auth/auth.module';
import config from './core/config';
import { ClsModule } from 'nestjs-cls';
import * as schema from './core/schema';
import { AuthGuard } from './routes/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccountModule } from './routes/account/account.module';
import { OrganizationModule } from './routes/organization/organization.module';
import { SchoolClassModule } from './routes/school-class/school-class.module';
import { SubjectModule } from './routes/subject/subject.module';
import { GradeModule } from './routes/grade/grade.module';
import { AbsenceModule } from './routes/absence/absence.module';
import { PostModule } from './routes/post/post.module';

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
		}),
		AccountModule,
		OrganizationModule,
		SchoolClassModule,
		SubjectModule,
		GradeModule,
		AbsenceModule,
		PostModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
