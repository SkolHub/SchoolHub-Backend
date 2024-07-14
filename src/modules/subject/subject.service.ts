import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class SubjectService extends DBService {
	async getSubjectStudents(subjectID: number) {
		if (this.role === 'student') {
			return (
				await this.db.execute(sql`
                    SELECT m.id, m.name
                    FROM "StudentToSubject" sts
                             INNER JOIN "StudentToSubject" st ON st."subjectID" = ${subjectID}
                             INNER JOIN "Member" m ON m.id = st."studentID"
                    WHERE sts."studentID" = ${this.userID}
                      AND sts."subjectID" = ${subjectID}
                `)
			).rows;
		} else if (this.role === 'teacher') {
			return (
				await this.db.execute(sql`
                    SELECT m.id, m.name
                    FROM "TeacherToSubject" tts
                             INNER JOIN "StudentToSubject" st ON st."subjectID" = ${subjectID}
                             INNER JOIN "Member" m ON m.id = st."studentID"
                    WHERE tts."teacherID" = ${this.userID}
                      AND tts."subjectID" = ${subjectID}
                `)
			).rows;
		}
	}

	async getSubjectTeachers(subjectID: number) {
		if (this.role === 'student') {
			return (
				await this.db.execute(sql`
                    SELECT m.id, m.name
                    FROM "StudentToSubject" sts
                             INNER JOIN "TeacherToSubject" t ON t."subjectID" = ${subjectID}
                             INNER JOIN "Member" m ON m.id = t."teacherID"
                    WHERE sts."studentID" = ${this.userID}
                      AND sts."subjectID" = ${subjectID}
                `)
			).rows;
		} else {
			return (
				await this.db.execute(sql`
                    SELECT m.id, m.name
                    FROM "TeacherToSubject" sts
                             INNER JOIN "TeacherToSubject" t ON t."subjectID" = ${subjectID}
                             INNER JOIN "Member" m ON m.id = t."teacherID"
                    WHERE sts."teacherID" = ${this.userID}
                      AND sts."subjectID" = ${subjectID}
                `)
			).rows;
		}
	}
}
