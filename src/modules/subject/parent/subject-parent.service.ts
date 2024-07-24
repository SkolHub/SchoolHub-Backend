import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class SubjectParentService extends DBService {
	async findMany() {
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
                                          ON sts."subjectID" = stsc."subjectID" AND sts."studentID" = ${this.studentID}
                               INNER JOIN "Subject" s ON s.id = stsc."subjectID"
                               INNER JOIN "SchoolClass" sc ON sc.id = stsc."schoolClassID"
                               INNER JOIN "TeacherToSubject" tts ON tts."subjectID" = s.id
                               LEFT JOIN "Member" m ON m.id = tts."teacherID"
                               LEFT JOIN "Grade" g ON g."subjectID" = s.id AND g."studentID" = ${this.studentID}
                      WHERE sttsc."studentID" = 5
                      GROUP BY s.id, sc.id) s
                GROUP BY s.id, s.name
            `)
		).rows;
	}

	async overallMetrics() {
		return this.db.execute(sql`
			SELECT (SELECT COUNT(*) FROM "Absence" a WHERE a."studentID" = ${this.studentID})  AS absences,
				   (SELECT AVG(g::int) FROM "Grade" g WHERE g."studentID" = ${this.studentID}) AS average
        `)

	}
}
