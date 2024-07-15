import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { grades } from '../../../database/schema/grades';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ParentGradeService extends DBService {
	findOne(subjectID: number) {
		return this.db
			.select({
				id: grades.id,
				timestamp: grades.timestamp,
				date: grades.date,
				reason: grades.reason,
				value: grades.value
			})
			.from(grades)
			.where(
				and(
					eq(grades.studentID, this.studentID),
					eq(grades.subjectID, subjectID)
				)
			);
	}
}
