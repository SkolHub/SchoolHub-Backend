import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { members } from '../../../database/schema/members';
import { grades } from '../../../database/schema/grades';

@Injectable()
export class StudentGradeService extends DBService {
	findAll() {
		return this.db
			.select({
				subjectID: grades.subjectID,
				grades: sql`JSONB_AGG
                (JSONB_BUILD_OBJECT('id', ${grades.id}, 'teacher', JSON_BUILD_OBJECT('id', ${members.id}, 'name', ${members.name}), 'timestamp', ${grades.timestamp}, 'date', ${grades.date}, 'reason', ${grades.reason}, 'value', ${grades.value}))`
			})
			.from(grades)
			.leftJoin(members, eq(members.id, grades.teacherID))
			.where(eq(grades.studentID, this.userID))
			.groupBy(grades.subjectID);
	}

	async findOne(subjectID: number) {
		return this.db
			.select({
				id: grades.id,
				reason: grades.reason,
				teacher: sql`JSON_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`,
				value: grades.value,
				timestamp: grades.timestamp,
				date: grades.date
			})
			.from(grades)
			.leftJoin(members, eq(members.id, grades.teacherID))
			.where(
				and(eq(grades.studentID, this.userID), eq(grades.subjectID, subjectID))
			);
	}
}
