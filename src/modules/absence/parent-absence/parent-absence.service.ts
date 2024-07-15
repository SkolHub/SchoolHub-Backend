import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq } from 'drizzle-orm';
import { absences } from '../../../database/schema/absences';

@Injectable()
export class ParentAbsenceService extends DBService {
	findOne(subjectID: number) {
		return this.db
			.select({
				id: absences.id,
				timestamp: absences.timestamp,
				date: absences.date,
				reason: absences.reason,
				excused: absences.excused
			})
			.from(absences)
			.where(
				and(
					eq(absences.studentID, this.studentID),
					eq(absences.subjectID, subjectID)
				)
			);
	}
}
