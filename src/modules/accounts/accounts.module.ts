import { Module } from '@nestjs/common';
import { AccountsAdminController } from './admin/accounts-admin.controller';
import { AccountsAdminService } from './admin/accounts-admin.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
	controllers: [AccountsAdminController, AccountsController],
	providers: [AccountsAdminService, AccountsService]
})
export class AccountsModule {}
