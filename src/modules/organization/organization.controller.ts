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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Organization operations')
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@Public()
	@ApiOperation({
		description: 'Creates an organization and an owner account (main admin)',
		summary: 'Create organization'
	})
	create(@Body() createOrganizationDto: CreateOrganizationDto) {
		return this.organizationService.create(createOrganizationDto);
	}

	@Patch()
	@UseGuards(AdminGuard)
	@ApiOperation({
		description: 'Updates the name of the organization',
		summary: 'Update organization'
	})
	update(@Body() updateOrganizationDto: UpdateOrganizationDto) {
		return this.organizationService.update(updateOrganizationDto);
	}

	@UseGuards(OwnerGuard)
	@Delete()
	@ApiOperation({
		description:
			'Deletes the organization. Only the owner may delete an organization',
		summary: 'Delete organization'
	})
	remove() {
		return this.organizationService.remove();
	}
}
