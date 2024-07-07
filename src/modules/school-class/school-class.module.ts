import { Module } from '@nestjs/common';
import { SchoolClassAdminService } from './admin/school-class-admin.service';
import { SchoolClassAdminController } from './admin/school-class-admin.controller';
import { SchoolClassMemberController } from './member/school-class-member.controller';
import { SchoolClassMemberService } from './member/school-class-member.service';

@Module({
	controllers: [SchoolClassAdminController, SchoolClassMemberController],
	providers: [SchoolClassAdminService, SchoolClassMemberService]
})
export class SchoolClassModule {}
