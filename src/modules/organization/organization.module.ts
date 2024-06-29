import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { OrganizationCommonModule } from './organization-common/organization-common.module';

@Module({
	imports: [
		OrganizationCommonModule,
		RouterModule.register([
			{
				path: 'organization',
				children: [
					{
						path: '',
						module: OrganizationCommonModule
					}
				]
			}
		])
	]
})
export class OrganizationModule {}
