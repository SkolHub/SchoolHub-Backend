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
		const teacher = await this.db
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
			.limit(1);

		if (!teacher[0].count) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		const students = await this.db
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
			);

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

	async findOne(absenceID: number, userID: number) {}

	update(
		updateAbsenceDto: UpdateAbsenceDto,
		absenceID: number,
		organizationID: number
	) {
		return `This action updates a #${absenceID} absence`;
	}

	remove(deleteAbsencesDto: DeleteAbsencesDto, organizationID: number) {
		return `This action removes a #${1} absence`;
	}
}
