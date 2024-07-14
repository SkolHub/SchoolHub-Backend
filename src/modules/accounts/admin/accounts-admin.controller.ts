import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { AccountsAdminService } from './accounts-admin.service';
import { OwnerGuard } from '../../../shared/guards/owner.guard';
import { AddAdminDto } from './dto/add-admin.dto';
import { ResetPasswordAdminDto } from './dto/reset-password-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin accounts')
@UseGuards(OwnerGuard)
export class AccountsAdminController {
	constructor(private readonly accountsService: AccountsAdminService) {}

	@Post()
	@ApiOperation({ description: 'Creates an admin', summary: 'Create admin' })
	create(@Body() addAdminDto: AddAdminDto) {
		return this.accountsService.create(addAdminDto);
	}

	@Get()
	@ApiOperation({ description: 'Gets all admins', summary: 'Get admins' })
	findAll() {
		return this.accountsService.findAll();
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Update an admin by ID',
		summary: 'Update admin'
	})
	update(
		@Body() updateAdminDto: UpdateAdminDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.update(updateAdminDto, id);
	}

	@Patch('password/:id')
	@ApiOperation({
		description: 'Reset the password of an admin',
		summary: 'Reset admin password'
	})
	resetPassword(
		@Body() resetPasswordAdminDto: ResetPasswordAdminDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.resetPassword(resetPasswordAdminDto, id);
	}

	@Delete(':id')
	@ApiOperation({
		description: 'Deletes an admin by ID',
		summary: 'Delete admin'
	})
	remove(@Param('id') id: number) {
		return this.accountsService.remove(id);
	}
}
