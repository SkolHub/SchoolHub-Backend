import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubjectMemberService } from './subject-member.service';
import { StudentGuard } from '../../../shared/guards/student.guard';
import { TeacherGuard } from '../../../shared/guards/teacher.guard';

@Controller()
export class SubjectMemberController {
	constructor(private readonly subjectService: SubjectMemberService) {}

	@Get('student')
	@UseGuards(StudentGuard)
	getStudentSubjects() {
		return this.subjectService.getStudentSubjects();
	}

	@Get('teacher')
	@UseGuards(TeacherGuard)
	getTeacherSubjects() {
		return this.subjectService.getTeacherSubjects();
	}
}
