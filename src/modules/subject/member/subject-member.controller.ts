import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { SubjectMemberService } from './subject-member.service';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';
import { RawMemberSession } from '../../../types/session';

@Controller()
@UseGuards(AdminGuard)
export class SubjectMemberController {
	constructor(private readonly subjectService: SubjectMemberService) {}

	@Get('student')
	@UseGuards(StudentGuard)
	getStudentSubjects(@Session() session: RawMemberSession) {
		return this.subjectService.getStudentSubjects(session.passport.user.userID);
	}

	@Get('teacher')
	@UseGuards(TeacherGuard)
	getTeacherSubjects(@Session() session: RawMemberSession) {
		return this.subjectService.getTeacherSubjects(session.passport.user.userID);
	}
}
