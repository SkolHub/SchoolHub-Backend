import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { observations } from '../../../database/schema/observations';
import { eq, sql } from 'drizzle-orm';
import { members } from '../../../database/schema/members';
import { subjects } from '../../../database/schema/subjects';

@Injectable()
export class ParentObservationService extends DBService {
	findAll() {
		return this.db
			.select({
				id: observations.id,
				reason: observations.reason,
				timestamp: observations.timestamp,
				teacher: sql`JSONB_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`,
				subject: sql`JSONB_BUILD_OBJECT
                    ('id', ${subjects.id}, 'name', ${subjects.name}, 'icon', ${subjects.icon})`
			})
			.from(observations)
			.innerJoin(members, eq(members.id, observations.teacherID))
			.innerJoin(subjects, eq(subjects.id, observations.subjectID))
			.where(eq(observations.studentID, this.studentID));
	}
}
