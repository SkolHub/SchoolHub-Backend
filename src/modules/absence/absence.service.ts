import { Injectable } from '@nestjs/common';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { DBService } from '../../common/db.service';
import { and, eq, inArray } from 'drizzle-orm';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { absences } from '../../database/schema/absences';
import { PermissionService } from '../../common/permission.service';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

@Injectable()
export class AbsenceService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createAbsencesDto: CreateAbsencesDto, teacherID: number) {
		await this.permissionService.canAssignObject(
			teacherID,
			createAbsencesDto.absences.map((absence) => absence.studentID),
			createAbsencesDto.subjectID
		);

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
			.select()
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

	async remove(deleteByIdDto: DeleteByIdDto, teacherID: number) {
		await this.db
			.delete(absences)
			.where(
				and(
					inArray(absences.id, deleteByIdDto.objects),
					eq(absences.teacherID, teacherID)
				)
			);
	}
}
