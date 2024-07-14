import { DBService } from '../../common/db.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { postSections } from '../../database/schema/post-sections';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { and, eq } from 'drizzle-orm';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';

@Injectable()
export class PostSectionService extends DBService {
	findAll(subjectID: number) {
		if (this.role === 'teacher') {
			return this.db
				.select({
					id: postSections.id,
					name: postSections.name
				})
				.from(postSections)
				.innerJoin(
					teachersToSubjects,
					and(
						eq(teachersToSubjects.subjectID, subjectID),
						eq(teachersToSubjects.teacherID, this.userID)
					)
				)
				.where(eq(postSections.subjectID, subjectID));
		}

		if (this.role === 'student') {
			return this.db
				.select({
					id: postSections.id,
					name: postSections.name
				})
				.from(postSections)
				.innerJoin(
					studentsToSubjects,
					and(
						eq(studentsToSubjects.subjectID, subjectID),
						eq(studentsToSubjects.studentID, this.userID)
					)
				)
				.where(eq(postSections.subjectID, subjectID));
		}

		throw new UnauthorizedException(
			'You are neither a teacher nor a student in this subject'
		);
	}
}
