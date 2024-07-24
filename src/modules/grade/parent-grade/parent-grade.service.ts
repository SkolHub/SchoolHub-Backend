import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { grades } from '../../../database/schema/grades';
import { and, eq, sql } from 'drizzle-orm';
import { members } from '../../../database/schema/members';

@Injectable()
export class ParentGradeService extends DBService {
	findOne(subjectID: number) {
		return this.db
			.select({
				id: grades.id,
				timestamp: grades.timestamp,
				date: grades.date,
				reason: grades.reason,
				value: grades.value,
				teacher: sql`JSONB_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`
			})
			.from(grades)
			.innerJoin(members, eq(members.id, grades.teacherID))
			.where(
				and(
					eq(grades.studentID, this.studentID),
					eq(grades.subjectID, subjectID)
				)
			);
	}
}
