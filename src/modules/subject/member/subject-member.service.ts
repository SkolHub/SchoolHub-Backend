import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { subjects } from '../../../database/schema/subjects';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';
import { schoolClasses } from '../../../database/schema/school-classes';
import { studentsToSchoolClasses } from '../../../database/schema/students-to-school-classes';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';

@Injectable()
export class SubjectMemberService extends DBService {
	getStudentSubjects(studentID: number) {
		return this.db
			.select({
				id: schoolClasses.id,
				name: schoolClasses.name,
				subjects: sql`JSON_AGG
                    (JSONB_BUILD_OBJECT('id', ${subjects.id}, 'name', ${subjects.name}))`
			})
			.from(studentsToSchoolClasses)
			.innerJoin(
				subjectsToSchoolClasses,
				eq(
					subjectsToSchoolClasses.schoolClassID,
					studentsToSchoolClasses.schoolClassID
				)
			)
			.innerJoin(
				studentsToSubjects,
				and(
					eq(studentsToSubjects.subjectID, subjectsToSchoolClasses.subjectID),
					eq(studentsToSubjects.studentID, studentID)
				)
			)
			.innerJoin(subjects, eq(subjects.id, subjectsToSchoolClasses.subjectID))
			.innerJoin(
				schoolClasses,
				eq(schoolClasses.id, subjectsToSchoolClasses.schoolClassID)
			)
			.where(eq(studentsToSchoolClasses.studentID, studentID))
			.groupBy(schoolClasses.id);
	}

	getTeacherSubjects(teacherID: number) {
		const sq = this.db
			.select({
				schoolClasses: sql`JSONB_AGG
                    (JSONB_BUILD_OBJECT('id', ${schoolClasses.id}, 'name', ${schoolClasses.name}))`.as(
					'schoolclasses'
				),
				id: subjects.id,
				name: subjects.name
			})
			.from(teachersToSubjects)
			.innerJoin(subjects, eq(subjects.id, teachersToSubjects.subjectID))
			.innerJoin(
				subjectsToSchoolClasses,
				eq(subjectsToSchoolClasses.subjectID, subjects.id)
			)
			.innerJoin(
				schoolClasses,
				eq(schoolClasses.id, subjectsToSchoolClasses.schoolClassID)
			)
			.where(eq(teachersToSubjects.teacherID, teacherID))
			.groupBy(subjects.id)
			.as('sq');

		return this.db
			.select({
				schoolClasses: sq.schoolClasses,
				subjects: sql`JSONB_AGG
                    (JSONB_BUILD_OBJECT('id', ${sq.id}, 'name', ${sq.name}))`
			})
			.from(sq)
			.groupBy(sq.schoolClasses);
	}
}
