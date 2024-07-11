import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { eq, sql } from 'drizzle-orm';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { subjects } from '../../../database/schema/subjects';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';
import { schoolClasses } from '../../../database/schema/school-classes';

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
                                                     INNER JOIN "SubjectToSchoolClass" stsc
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

	async getStudentSubjectsWithMetrics() {
		return (
			await this.db.execute(sql`
                SELECT s.id,
                       s.name,
                       JSON_AGG(JSONB_BUILD_OBJECT('id', s.sid, 'name', s.sname, 'metadata', s.metadata, 'teachers',
                                                   s.teachers, 'grades', s.sgrades, 'average',
                                                   s.saverage)) as subjects
                FROM (SELECT sc.id,
                             sc.name,
                             s.id                                                              as sid,
                             s.name                                                            as sname,
                             s.metadata                                                        as metadata,
                             JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', m.id, 'name', m.name)) as teachers,
                             COALESCE(COUNT(DISTINCT g), 0)                                    as sgrades,
                             AVG(g.value::int)                                                 as saverage
                      FROM "StudentToSchoolClass" sttsc
                               INNER JOIN "SubjectToSchoolClass" stsc
                                          ON stsc."schoolClassID" = sttsc."schoolClassID"
                               INNER JOIN "StudentToSubject" sts
                                          ON sts."subjectID" = stsc."subjectID" AND sts."studentID" = ${this.userID}
                               INNER JOIN "Subject" s ON s.id = stsc."subjectID"
                               INNER JOIN "SchoolClass" sc ON sc.id = stsc."schoolClassID"
                               INNER JOIN "TeacherToSubject" tts ON tts."subjectID" = s.id
                               LEFT JOIN "Member" m ON m.id = tts."teacherID"
                               LEFT JOIN "Grade" g ON g."subjectID" = s.id AND g."studentID" = ${this.userID}
                      WHERE sttsc."studentID" = 5
                      GROUP BY s.id, sc.id) s
                GROUP BY s.id, s.name
            `)
		).rows;
	}

	async getStudentSubjectByID(subjectID: number) {
		return (
			await this.db.execute(sql`
                SELECT (SELECT AVG(COALESCE(g.value::int, 0))
                        FROM "Grade" g
                        WHERE g."subjectID" = sts."subjectID"
                          AND g."studentID" = sts."studentID")::float as average,
                       (SELECT COUNT(a)
                        FROM "Absence" a
                        WHERE a."subjectID" = sts."subjectID"
                          AND a."studentID" = sts."studentID"
                          AND a.excused = false)::int                 as absences,
                       (SELECT COUNT(p)
                        FROM "Post" p
                        WHERE p."subjectID" = sts."subjectID"
                          AND p.post_type = 'assignment')::int        as assignments
                FROM "StudentToSubject" sts
                WHERE sts."studentID" = ${this.userID}
                  AND sts."subjectID" = ${subjectID};
            `)
		).rows[0];
	}

	async getTeacherSubjects() {
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

	async getTeacherSubjectByID(subjectID: number) {
		return (
			await this.db.execute(sql`
            SELECT AVG(sq.average) as average, AVG(sq.count) as averageCount
            FROM (SELECT AVG(g.value::int)                                                    AS average,
                         LEAST(COUNT(g), COALESCE((s.metadata ->> 'minGrades')::int, 100000)) AS count
                  FROM "TeacherToSubject" tts
                           INNER JOIN "Subject" s ON s.id = ${subjectID}
                           INNER JOIN "Grade" g ON g."subjectID" = ${subjectID}
                  WHERE tts."subjectID" = ${subjectID}
                    AND tts."teacherID" = ${this.userID}
                  GROUP BY g."studentID", s.id) sq
        `)
		).rows[0];
	}

	async getStudentsWithFewGradesCount(subjectID: number) {
		return (
			await this.db.execute(sql`
                SELECT COUNT(*)
                FROM (SELECT COUNT(g.value) as count
                      FROM "TeacherToSubject" tts
                               INNER JOIN "Grade" g ON g."subjectID" = ${subjectID}
                      WHERE tts."subjectID" = ${subjectID}
                        AND tts."teacherID" = ${this.userID}
                      GROUP BY g."studentID") sq
                WHERE sq.count < 3
            `)
		).rows[0];
	}
}
