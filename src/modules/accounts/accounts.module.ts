import { Module } from '@nestjs/common';
import { AccountsAdminController } from './admin/accounts-admin.controller';
import { AccountsAdminService } from './admin/accounts-admin.service';

@Module({
	controllers: [AccountsAdminController],
	providers: [AccountsAdminService]
})
export class AccountsModule {}
