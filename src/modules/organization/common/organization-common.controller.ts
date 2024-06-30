import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationCommonService } from './organization-common.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Public } from '../../../common/decorators/public.decorator';

@Controller()
export class OrganizationCommonController {
	constructor(
		private readonly organizationCommonService: OrganizationCommonService
	) {}

	@Post()
	@Public()
	create(@Body() createOrganizationCommonDto: CreateOrganizationDto) {
		return this.organizationCommonService.create(createOrganizationCommonDto);
	}
}
