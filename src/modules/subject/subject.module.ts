import { Module } from '@nestjs/common';
import { SubjectAdminService } from './admin/subject-admin.service';
import { SubjectAdminController } from './admin/subject-admin.controller';
import { SubjectMemberController } from './member/subject-member.controller';
import { SubjectMemberService } from './member/subject-member.service';

@Module({
	controllers: [SubjectMemberController, SubjectAdminController],
	providers: [SubjectMemberService, SubjectAdminService]
})
export class SubjectModule {}
