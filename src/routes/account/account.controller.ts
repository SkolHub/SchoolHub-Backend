import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.accountService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
		return this.accountService.update(+id, updateAccountDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.accountService.remove(+id);
	}
}
