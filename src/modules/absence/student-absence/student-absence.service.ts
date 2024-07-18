import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { members } from '../../../database/schema/members';
import { absences } from '../../../database/schema/absences';

@Injectable()
export class StudentAbsenceService extends DBService {
	findAll() {
		return this.db
			.select({
				subjectID: absences.subjectID,
				absences: sql`JSONB_AGG
                (JSONB_BUILD_OBJECT('id', ${absences.id}, 'teacher', JSON_BUILD_OBJECT('id', ${members.id}, 'name', ${members.name}), 'timestamp', ${absences.timestamp}, 'date', ${absences.date}, 'reason', ${absences.reason}, 'excused', ${absences.excused}))`
			})
			.from(absences)
			.leftJoin(members, eq(members.id, absences.teacherID))
			.where(eq(absences.studentID, this.userID))
			.groupBy(absences.subjectID);
	}

	async findOne(subjectID: number) {
		return this.db
			.select({
				id: absences.id,
				reason: absences.reason,
				teacher: sql`JSON_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`,
				excused: absences.excused,
				timestamp: absences.timestamp,
				date: absences.date
			})
			.from(absences)
			.leftJoin(members, eq(members.id, absences.teacherID))
			.where(
				and(
					eq(absences.studentID, this.userID),
					eq(absences.subjectID, subjectID)
				)
			);
	}
}
