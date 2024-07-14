import { Injectable } from '@nestjs/common';
import { CreateAbsencesDto } from './dto/create-absences.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { DBService } from '../../../common/db.service';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { absences } from '../../../database/schema/absences';
import { PermissionService } from '../../../common/permission.service';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { ExcuseAbsencesDto } from './dto/excuse-absences.dto';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';

@Injectable()
export class TeacherAbsenceService extends DBService {
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
				studentID: absence.studentID,
				subjectID: createAbsencesDto.subjectID,
				teacherID: this.userID
			}))
		);
	}

	async getStudentAbsences(subjectID: number, studentID: number) {
		return this.db
			.select({
				id: absences.id,
				date: absences.date,
				timestamp: absences.timestamp,
				teacherID: absences.teacherID,
				excused: absences.excused
			})
			.from(teachersToSubjects)
			.innerJoin(
				absences,
				and(
					eq(absences.subjectID, subjectID),
					eq(absences.studentID, studentID)
				)
			)
			.where(
				and(
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			);
	}

	async excuse(excuseAbsencesDto: ExcuseAbsencesDto) {
		await this.db.execute(sql`
            UPDATE "Absence"
            SET excused = true,
                reason  = ${excuseAbsencesDto.reason}
            WHERE id IN (SELECT a.id
                         FROM "Absence" a
                                  INNER JOIN "SubjectToSchoolClass" stsc ON stsc."subjectID" = a."subjectID"
                                  INNER JOIN "StudentToSchoolClass" sttsc ON sttsc."studentID" = a."studentID"
                                  INNER JOIN "SchoolClass" sc
                                             ON sc.id = stsc."schoolClassID" AND
                                                sc.id = sttsc."schoolClassID" AND
                                                sc."classMasterID" = ${this.userID}
                         WHERE a.id IN ${excuseAbsencesDto.absences});
        `);
	}

	async update(updateAbsenceDto: UpdateAbsenceDto, absenceID: number) {
		await this.db.execute(sql`
            UPDATE "Absence"
            SET reason = ${updateAbsenceDto.reason}
            WHERE id IN (SELECT a.id
                         FROM "Absence" a
                                  INNER JOIN "SubjectToSchoolClass" stsc ON stsc."subjectID" = a."subjectID"
                                  INNER JOIN "StudentToSchoolClass" sttsc ON sttsc."studentID" = a."studentID"
                                  INNER JOIN "SchoolClass" sc
                                             ON sc.id = stsc."schoolClassID" AND
                                                sc.id = sttsc."schoolClassID" AND
                                                sc."classMasterID" = ${this.userID}
                         WHERE a.id = ${absenceID});
        `);

		await this.db
			.update(absences)
			.set({
				reason: updateAbsenceDto.reason
			})
			.where(
				and(
					eq(absences.id, absenceID),
					eq(absences.teacherID, this.userID),
					eq(absences.excused, true)
				)
			);
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
