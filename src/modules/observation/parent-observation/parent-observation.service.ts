import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { observations } from '../../../database/schema/observations';
import { eq, sql } from 'drizzle-orm';
import { members } from '../../../database/schema/members';

@Injectable()
export class ParentObservationService extends DBService {
	findAll() {
		return this.db
			.select({
				id: observations.id,
				reason: observations.reason,
				timestamp: observations.timestamp,
				teacher: sql`JSON_BUILD_OBJECT
                    ('id', ${members.id}, 'name', ${members.name})`
			})
			.from(observations)
			.innerJoin(members, eq(members.id, observations.teacherID))
			.where(eq(observations.studentID, this.studentID));
	}
}
