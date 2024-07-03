import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import config from './config/config';
import * as schema from './database/schema';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_GUARD, RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthenticatedGuard } from './shared/guards/auth.guard';
import { DrizzleFilter } from './common/filters/drizzle.filter';
import { ProfileModule } from './modules/profile/profile.module';
import { SubjectModule } from './modules/subject/subject.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ObservationModule } from './modules/observation/observation.module';
import { SchoolClassModule } from './modules/school-class/school-class.module';
import { GradeModule } from './modules/grade/grade.module';
import { AbsenceModule } from './modules/absence/absence.module';
import { PostModule } from './modules/post/post.module';
import { TestModule } from './modules/test/test.module';

const routes: Routes = [
	{
		path: 'auth',
		module: AuthModule
	},
	{
		path: 'organization',
		module: OrganizationModule
	},
	{
		path: 'profile',
		module: ProfileModule
	},
	{
		path: 'accounts',
		module: AccountsModule
	},
	{
		path: 'school-class',
		module: SchoolClassModule
	},
	{
		path: 'subject',
		module: SubjectModule
	},
	{
		path: 'absence',
		module: AbsenceModule
	},
	{
		path: 'grade',
		module: GradeModule
	},
	{
		path: 'observation',
		module: ObservationModule
	},
	{
		path: 'post',
		module: PostModule
	},
	{
		path: 'test',
		module: TestModule
	}
];

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
		PassportModule.register({
			session: true
		}),
		RouterModule.register(routes),
		AuthModule,
		OrganizationModule,
		AccountsModule,
		ProfileModule,
		SubjectModule,
		ObservationModule,
		GradeModule,
		AbsenceModule,
		PostModule,
		TestModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthenticatedGuard
		},
		{
			provide: APP_FILTER,
			useClass: DrizzleFilter
		}
	]
})
export class AppModule {}
