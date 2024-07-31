import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { schoolClasses } from '../../../database/schema/school-classes';

@Injectable()
export class SchoolClassClassMasterService extends DBService {
	async findStudent(schoolClassID: number, studentID: number) {
		return (
			await this.db.execute(sql`
            SELECT s.name,
                   s.id,
                   s.icon,
                   s.metadata,
                   JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', g.id, 'value', g.value, 'teacher',
                                                         JSONB_BUILD_OBJECT('id', gm.id, 'name', gm.name), 'date',
                                                         g.date,
                                                         'timestamp',
                                                         g.timestamp, 'reason', g.reason)) AS grades,
                   JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'excused', a.excused, 'teacher',
                                                         JSONB_BUILD_OBJECT('id', am.id, 'name', am.name), 'date',
                                                         a.date,
                                                         'timestamp',
                                                         a.timestamp, 'reason', a.reason)) AS absences
            FROM "SubjectToSchoolClass" stsc
                     INNER JOIN "StudentToSubject" sts
                                ON sts."studentID" = ${studentID} AND sts."subjectID" = stsc."subjectID"
                     INNER JOIN "Subject" s ON s.id = stsc."subjectID"
                     LEFT JOIN "TeacherToSubject" tts ON tts."subjectID" = s.id
                     LEFT JOIN "Absence" a ON a."subjectID" = s.id AND a."studentID" = ${studentID}
                     INNER JOIN "Member" am ON am.id = a."teacherID"
                     LEFT JOIN "Grade" g ON g."subjectID" = s.id AND g."studentID" = ${studentID}
                     INNER JOIN "Member" gm ON gm.id = g."teacherID"
                     
            WHERE stsc."schoolClassID" = ${schoolClassID}
            GROUP BY s.id;
        `)
		).rows;
	}

	findOne(schoolClassID: number) {
		return this.db.query.schoolClasses.findFirst({
			where: and(
				eq(schoolClasses.id, schoolClassID),
				eq(schoolClasses.classMasterID, this.userID)
			),
			with: {
				subjects: {
					with: {
						subject: true
					}
				},
				students: {
					with: {
						student: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});
	}
}
