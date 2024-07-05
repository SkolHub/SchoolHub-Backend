import {
	Body,
	Controller,
	Delete,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Public } from '../../common/decorators/public.decorator';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { OwnerGuard } from '../../shared/guards/owner.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller()
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@Public()
	create(@Body() createOrganizationDto: CreateOrganizationDto) {
		return this.organizationService.create(createOrganizationDto);
	}

	@Patch()
	@UseGuards(AdminGuard)
	update(@Body() updateOrganizationDto: UpdateOrganizationDto) {
		return this.organizationService.update(updateOrganizationDto);
	}

	@UseGuards(OwnerGuard)
	@Delete()
	remove() {
		return this.organizationService.remove();
	}
}
