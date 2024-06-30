import { Module } from '@nestjs/common';
import { OrganizationCommonController } from './common/organization-common.controller';
import { OrganizationCommonService } from './common/organization-common.service';
import { OrganizationAdminController } from './admin/organization-admin.controller';
import { OrganizationAdminService } from './admin/organization-admin.service';
import {OrganizationOwnerController} from "./owner/organization-owner.controller";
import {OrganizationOwnerService} from "./owner/organization-owner.service";

@Module({
	controllers: [
		OrganizationCommonController,
		OrganizationAdminController,
		OrganizationOwnerController
	],
	providers: [
		OrganizationCommonService,
		OrganizationAdminService,
		OrganizationOwnerService
	]
})
export class OrganizationModule {}
