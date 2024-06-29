import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationCommonService } from './organization-common.service';
import { CreateOrganizationCommonDto } from './dto/create-organization-common.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller()
export class OrganizationCommonController {
	constructor(
		private readonly organizationCommonService: OrganizationCommonService
	) {}

	@Post()
	@Public()
	create(@Body() createOrganizationCommonDto: CreateOrganizationCommonDto) {
		return this.organizationCommonService.create(createOrganizationCommonDto);
	}
}
