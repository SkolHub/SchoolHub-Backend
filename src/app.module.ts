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
import { SchoolClassModule } from './modules/school-class/school-class.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ObservationModule } from './modules/observation/observation.module';
import { AbsenceModule } from './modules/absence/absence.module';
import { GradeModule } from './modules/grade/grade.module';
import { PostModule } from './modules/post/post.module';
import { SchoolClassesModule } from './modules/school-classes/school-classes.module';
import { SubjectModule } from './modules/subject/subject.module';
import { AccountsModule } from './accounts/accounts.module';
import { AccountsModule } from './modules/accounts/accounts.module';

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
		SchoolClassModule,
		SchoolClassesModule,
		PostModule,
		GradeModule,
		AbsenceModule,
		ObservationModule
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
