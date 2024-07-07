import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, eq } from 'drizzle-orm';
import { schoolClasses } from '../../../database/schema/school-classes';

@Injectable()
export class SchoolClassMemberService extends DBService {
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
