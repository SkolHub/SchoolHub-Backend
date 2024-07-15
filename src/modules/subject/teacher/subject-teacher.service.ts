import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { eq, sql } from 'drizzle-orm';
import { schoolClasses } from '../../../database/schema/school-classes';
import { subjects } from '../../../database/schema/subjects';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';

@Injectable()
export class SubjectTeacherService extends DBService {
	async getSubjects() {
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

	async getSubjectStudents(subjectID: number) {
		return (
			await this.db.execute(sql`
            SELECT jsonb_build_object('id', m.id, 'name', m.name) AS student,
                   avg(g.value::int)                              as average,
                   count(g)                                       as count
            FROM "TeacherToSubject" tts
                     INNER JOIN "StudentToSubject" sts ON sts."subjectID" = ${subjectID}
                     INNER JOIN "Member" m ON m.id = sts."studentID"
                     LEFT JOIN "Grade" g ON g."studentID" = sts."studentID"
            WHERE tts."subjectID" = ${subjectID}
              AND tts."teacherID" = ${this.userID}
            GROUP BY m.id
        `)
		).rows;
	}

	async getSubjectGradeMetricsByID(subjectID: number) {
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
