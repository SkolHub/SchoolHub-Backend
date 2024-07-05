import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { eq, sql } from 'drizzle-orm';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { subjects } from '../../../database/schema/subjects';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';
import { schoolClasses } from '../../../database/schema/school-classes'; // SELECT s.id,

// SELECT s.id,
//        s.name,
//        JSON_AGG(JSONB_BUILD_OBJECT('id', s.sid, 'name', s.sname, 'teachers', s.teachers)) as subjects
// FROM (SELECT sc.id,
//              sc.name,
//              s.id                                                     as sid,
//              s.name                                                   as sname,
//              JSON_AGG(JSONB_BUILD_OBJECT('id', m.id, 'name', m.name)) as teachers
//       FROM "StudentToSchoolClass" sttsc
//                INNER JOIN "subjectToSchoolClass" stsc ON stsc."schoolClassID" = sttsc."schoolClassID"
//                INNER JOIN "StudentToSubject" sts ON sts."subjectID" = stsc."subjectID" AND sts."studentID" = 5
//                INNER JOIN "Subject" s ON s.id = stsc."subjectID"
//                INNER JOIN "SchoolClass" sc ON sc.id = stsc."schoolClassID"
//                INNER JOIN "TeacherToSubject" tts ON tts."subjectID" = s.id
//                INNER JOIN "Member" m ON m.id = tts."teacherID"
//       WHERE sttsc."studentID" = 5
//       GROUP BY s.id, sc.id) s
// GROUP BY s.id, s.name;

@Injectable()
export class SubjectMemberService extends DBService {
	async getStudentSubjects() {
		return (
			await this.db.execute(sql`SELECT s.id,
                                             s.name,
                                             JSON_AGG(JSONB_BUILD_OBJECT('id', s.sid, 'name', s.sname, 'teachers',
                                                                         s.teachers)) as subjects
                                      FROM (SELECT sc.id,
                                                   sc.name,
                                                   s.id                                                     as sid,
                                                   s.name                                                   as sname,
                                                   JSON_AGG(JSONB_BUILD_OBJECT('id', m.id, 'name', m.name)) as teachers
                                            FROM "StudentToSchoolClass" sttsc
                                                     INNER JOIN "subjectToSchoolClass" stsc
                                                                ON stsc."schoolClassID" = sttsc."schoolClassID"
                                                     INNER JOIN "StudentToSubject" sts
                                                                ON sts."subjectID" = stsc."subjectID" AND sts."studentID" = ${this.userID}
                                                     INNER JOIN "Subject" s ON s.id = stsc."subjectID"
                                                     INNER JOIN "SchoolClass" sc ON sc.id = stsc."schoolClassID"
                                                     INNER JOIN "TeacherToSubject" tts ON tts."subjectID" = s.id
                                                     INNER JOIN "Member" m ON m.id = tts."teacherID"
                                            WHERE sttsc."studentID" = ${this.userID}
                                            GROUP BY s.id, sc.id) s
                                      GROUP BY s.id, s.name`)
		).rows;
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
			.where(eq(teachersToSubjects.teacherID, this.userID))
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
