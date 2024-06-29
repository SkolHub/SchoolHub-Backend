import { Module } from '@nestjs/common';
import { OrganizationCommonService } from './organization-common.service';
import { OrganizationCommonController } from './organization-common.controller';

@Module({
  controllers: [OrganizationCommonController],
  providers: [OrganizationCommonService],
})
export class OrganizationCommonModule {}
