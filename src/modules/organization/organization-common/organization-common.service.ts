import { Injectable } from '@nestjs/common';
import { CreateOrganizationCommonDto } from './dto/create-organization-common.dto';

@Injectable()
export class OrganizationCommonService {
	create(createOrganizationCommonDto: CreateOrganizationCommonDto) {
		return 'This action adds a new organizationCommon';
	}
}
