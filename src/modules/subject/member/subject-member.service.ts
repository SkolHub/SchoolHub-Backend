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
	getStudentSubjects() {
		return this.db
			.select({
				id: schoolClasses.id,
				name: schoolClasses.name,
				subjects: sql`JSON_AGG
                (JSONB_BUILD_OBJECT('id', ${subjects.id}, 'name', ${subjects.name}, 'icon', ${subjects.icon}, 'metadata', ${subjects.metadata}))`
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
					eq(studentsToSubjects.studentID, this.organizationID)
				)
			)
			.innerJoin(subjects, eq(subjects.id, subjectsToSchoolClasses.subjectID))
			.innerJoin(
				schoolClasses,
				eq(schoolClasses.id, subjectsToSchoolClasses.schoolClassID)
			)
			.where(eq(studentsToSchoolClasses.studentID, this.organizationID))
			.groupBy(schoolClasses.id);
	}

	getTeacherSubjects() {
		const sq = this.db
			.select({
				schoolClasses: sql`JSONB_AGG
                    (JSONB_BUILD_OBJECT('id', ${schoolClasses.id}, 'name', ${schoolClasses.name}))`.as(
					'schoolClasses'
				),
				id: subjects.id,
				name: subjects.name,
				icon: subjects.icon,
				metadata: subjects.metadata
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
			.where(eq(teachersToSubjects.teacherID, this.organizationID))
			.groupBy(subjects.id)
			.as('sq');

		return this.db
			.select({
				schoolClasses: sq.schoolClasses,
				subjects: sql`JSONB_AGG
                (JSONB_BUILD_OBJECT('id', ${sq.id}, 'name', ${sq.name}, 'icon', ${sq.icon}, 'metadata', ${subjects.metadata}))`
			})
			.from(sq)
			.groupBy(sq.schoolClasses);
	}
}
