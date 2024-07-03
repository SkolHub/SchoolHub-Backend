import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { DeleteAbsencesDto } from './dto/delete-absences.dto';
import { DBService } from '../../common/db.service';
import { and, count, eq, inArray } from 'drizzle-orm';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { absences } from '../../database/schema/absences';

@Injectable()
export class AbsenceService extends DBService {
	async create(createAbsencesDto: CreateAbsencesDto, teacherID: number) {
		const [teacher, students] = await Promise.all([
			this.db
				.select({
					count: count()
				})
				.from(teachersToSubjects)
				.where(
					and(
						eq(teachersToSubjects.teacherID, teacherID),
						eq(teachersToSubjects.subjectID, createAbsencesDto.subjectID)
					)
				)
				.limit(1),
			this.db
				.select({
					count: count()
				})
				.from(studentsToSubjects)
				.where(
					and(
						inArray(
							studentsToSubjects.studentID,
							createAbsencesDto.absences.map((absence) => absence.studentID)
						),
						eq(studentsToSubjects.subjectID, createAbsencesDto.subjectID)
					)
				)
		]);

		if (!teacher[0].count) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		if (students.length !== createAbsencesDto.absences.length) {
			throw new ForbiddenException("Students don't belong to this class");
		}

		await this.db.insert(absences).values(
			createAbsencesDto.absences.map((absence) => ({
				date: absence.date,
				reason: absence.reason,
				studentID: absence.studentID,
				subjectID: createAbsencesDto.subjectID,
				teacherID
			}))
		);
	}

	findOne(absenceID: number, teacherID: number) {
		return this.db
			.select({
				date: absences.date,
				reason: absences.reason,
				studentID: absences.studentID,
				teacherID: absences.teacherID,
				subjectID: absences.subjectID,
				timestamp: absences.timestamp,
				id: absences.id
			})
			.from(absences)
			.innerJoin(
				teachersToSubjects,
				and(
					eq(teachersToSubjects.subjectID, absences.subjectID),
					eq(teachersToSubjects.teacherID, teacherID)
				)
			)
			.where(eq(absences.id, absenceID));
	}

	async update(
		updateAbsenceDto: UpdateAbsenceDto,
		absenceID: number,
		teacherID: number
	) {
		await this.db
			.update(absences)
			.set({
				reason: updateAbsenceDto.reason
			})
			.where(
				and(eq(absences.id, absenceID), eq(absences.teacherID, teacherID))
			);
	}

	async remove(deleteAbsencesDto: DeleteAbsencesDto, teacherID: number) {
		await this.db
			.delete(absences)
			.where(
				and(
					inArray(absences.id, deleteAbsencesDto.absences),
					eq(absences.teacherID, teacherID)
				)
			);
	}
}
