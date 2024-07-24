import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { absences } from '../../../database/schema/absences';
import { members } from '../../../database/schema/members';
import { grades } from '../../../database/schema/grades';

@Injectable()
export class ParentAbsenceService extends DBService {
	findOne(subjectID: number) {
		return this.db
			.select({
				id: absences.id,
				timestamp: absences.timestamp,
				date: absences.date,
				reason: absences.reason,
				excused: absences.excused,
				teacher: sql`JSONB_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`
			})
			.from(absences)
			.innerJoin(members, eq(members.id, grades.teacherID))
			.where(
				and(
					eq(absences.studentID, this.studentID),
					eq(absences.subjectID, subjectID)
				)
			);
	}
}
