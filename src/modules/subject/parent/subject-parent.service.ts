import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import { eq } from 'drizzle-orm';
import { subjects } from '../../../database/schema/subjects';

@Injectable()
export class SubjectParentService extends DBService {
	findMany() {
		return this.db
			.select({
				id: subjects.id,
				name: subjects.name,
				icon: subjects.icon
			})
			.from(studentsToSubjects)
			.innerJoin(subjects, eq(subjects.id, studentsToSubjects.subjectID))
			.where(eq(studentsToSubjects.studentID, this.studentID))
			.groupBy(subjects.id);
	}
}
