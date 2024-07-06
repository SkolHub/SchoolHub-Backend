import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards
} from '@nestjs/common';
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

	@Get('student/:id')
	@UseGuards(StudentGuard)
	getStudentSubjectByID(@Param('id', ParseIntPipe) id: number) {
		return this.subjectService.getStudentSubjectByID(id);
	}

	@Get('teacher')
	@UseGuards(TeacherGuard)
	getTeacherSubjects() {
		return this.subjectService.getTeacherSubjects();
	}
}
