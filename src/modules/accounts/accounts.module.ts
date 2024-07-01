import { Module } from '@nestjs/common';
import { AccountsAdminController } from './admin/accounts-admin.controller';
import { AccountsAdminService } from './admin/accounts-admin.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
	controllers: [AccountsAdminController, MemberController],
	providers: [AccountsAdminService, MemberService]
})
export class AccountsModule {}
