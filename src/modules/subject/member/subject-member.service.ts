import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq } from 'drizzle-orm';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import {schoolClasses} from "../../../database/schema/school-classes";

@Injectable()
export class SubjectMemberService extends DBService {
	getStudentSubjects(studentID: number) {
		return this.db.query.studentsToSubjects.findMany({
			where: and(eq(studentsToSubjects.studentID, studentID)),
			with: {
				subject: {
					columns: {
						id: true,
						name: true
					},
					with: {}
				}
			}
		});
	}

	getTeacherSubjects(teacherID: number) {
		return this.db.query.teachersToSubjects.findMany({
			columns: {},
			with: {
				subject: {
					columns: {
						id: true,
						name: true
					},
					with: {
						schoolClasses: {

						}
					}
				}
			}
		});
	}
}
