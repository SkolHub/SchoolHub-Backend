import { Injectable } from '@nestjs/common';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { DBService } from '../../common/db.service';
import { and, eq, inArray } from 'drizzle-orm';
import { absences } from '../../database/schema/absences';
import { PermissionService } from '../../common/permission.service';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { ExcuseAbsencesDto } from './dto/excuse-absences.dto';

@Injectable()
export class AbsenceService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createAbsencesDto: CreateAbsencesDto) {
		await this.permissionService.canAssignObject(
			this.userID,
			createAbsencesDto.absences.map((absence) => absence.studentID),
			createAbsencesDto.subjectID
		);

		await this.db.insert(absences).values(
			createAbsencesDto.absences.map((absence) => ({
				date: absence.date,
				reason: absence.reason,
				studentID: absence.studentID,
				subjectID: createAbsencesDto.subjectID,
				teacherID: this.userID
			}))
		);
	}

	async update(updateAbsenceDto: UpdateAbsenceDto, absenceID: number) {
		await this.db
			.update(absences)
			.set({
				reason: updateAbsenceDto.reason
			})
			.where(
				and(eq(absences.id, absenceID), eq(absences.teacherID, this.userID))
			);
	}

	async excuse(excuseAbsencesDto: ExcuseAbsencesDto) {
		return;
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(absences)
			.where(
				and(
					inArray(absences.id, deleteByIdDto.objects),
					eq(absences.teacherID, this.userID)
				)
			);
	}
}
