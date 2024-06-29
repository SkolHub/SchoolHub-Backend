import { Module } from '@nestjs/common';
import { OrganizationCommonController } from './common/organization-common.controller';
import { OrganizationCommonService } from './common/organization-common.service';
import { OrganizationAdminController } from './admin/organization-admin.controller';
import { OrganizationAdminService } from './admin/organization-admin.service';

@Module({
	controllers: [OrganizationCommonController, OrganizationAdminController],
	providers: [OrganizationCommonService, OrganizationAdminService]
})
export class OrganizationModule {}
