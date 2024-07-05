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

@Controller('admin')
@UseGuards(OwnerGuard)
export class AccountsAdminController {
	constructor(private readonly accountsService: AccountsAdminService) {}

	@Post()
	create(@Body() addAdminDto: AddAdminDto) {
		return this.accountsService.create(addAdminDto);
	}

	@Get()
	findAll() {
		return this.accountsService.findAll();
	}

	@Patch(':id')
	update(
		@Body() updateAdminDto: UpdateAdminDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.update(updateAdminDto, id);
	}

	@Patch('password/:id')
	resetPassword(
		@Body() resetPasswordAdminDto: ResetPasswordAdminDto,
		@Param('id', ParseIntPipe) id: number
	) {
		return this.accountsService.resetPassword(resetPasswordAdminDto, id);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.accountsService.remove(id);
	}
}
