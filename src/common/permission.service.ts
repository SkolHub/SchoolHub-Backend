import { DBService } from './db.service';
import { and, count, eq, inArray } from 'drizzle-orm';
import { teachersToSubjects } from '../database/schema/teachers-to-subjects';
import { studentsToSubjects } from '../database/schema/students-to-subjects';
import { ForbiddenException } from '@nestjs/common';

export class PermissionService extends DBService {
	async isTeacherInSubject(teacherID: number, subjectID: number) {
		return (
			(
				await this.db
					.select({
						count: count()
					})
					.from(teachersToSubjects)
					.where(
						and(
							eq(teachersToSubjects.teacherID, teacherID),
							eq(teachersToSubjects.subjectID, subjectID)
						)
					)
					.limit(1)
			)[0].count === 1
		);
	}

	async isStudentInSubject(studentID: number, subjectID: number) {
		return (
			(
				await this.db
					.select({
						count: count()
					})
					.from(studentsToSubjects)
					.where(
						and(
							eq(studentsToSubjects.studentID, studentID),
							eq(studentsToSubjects.subjectID, subjectID)
						)
					)
					.limit(1)
			)[0].count === 1
		);
	}

	async areStudentsInSubject(students: number[], subjectID: number) {
		return (
			(
				await this.db
					.select({
						count: count()
					})
					.from(studentsToSubjects)
					.where(
						and(
							inArray(studentsToSubjects.studentID, students),
							eq(studentsToSubjects.subjectID, subjectID)
						)
					)
			)[0].count === students.length
		);
	}

	async canAssignObject(
		teacherID: number,
		students: number[],
		subjectID: number
	) {
		const [teacherValid, studentsValid] = await Promise.all([
			this.isTeacherInSubject(teacherID, subjectID),
			this.areStudentsInSubject(students, subjectID)
		]);

		if (!teacherValid) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		if (!studentsValid) {
			throw new ForbiddenException("Students don't belong to this subject");
		}
	}
}
