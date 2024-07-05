import { Injectable } from '@nestjs/common';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { DBService } from '../../common/db.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { grades } from '../../database/schema/grades';
import { PermissionService } from '../../common/permission.service';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { absences } from '../../database/schema/absences';

@Injectable()
export class GradeService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createGradesDto: CreateGradesDto, teacherID: number) {
		await this.permissionService.canAssignObject(
			teacherID,
			createGradesDto.grades.map((grade) => grade.studentID),
			createGradesDto.subjectID
		);

		await this.db.insert(grades).values(
			createGradesDto.grades.map((grade) => ({
				date: grade.date,
				reason: grade.reason,
				value: grade.value,
				studentID: grade.studentID,
				subjectID: createGradesDto.subjectID,
				teacherID
			}))
		);
	}

	async getOrganizationObjectsStudent(userID: number) {
		const [gr, ab] = await Promise.all([
			this.db
				.select({
					subjectID: grades.subjectID,
					grades: sql`JSONB_AGG
                    (JSONB_BUILD_OBJECT('id', ${grades.id}, 'teacherID', ${grades.teacherID}, 'timestamp', ${grades.timestamp}, 'date', ${grades.date}, 'reason', ${grades.reason}, 'value', ${grades.value}))`
				})
				.from(grades)
				.where(eq(grades.studentID, userID))
				.groupBy(grades.subjectID),
			this.db
				.select({
					subjectID: absences.subjectID,
					grades: sql`JSONB_AGG
                    (JSONB_BUILD_OBJECT('id', ${absences.id}, 'teacherID', ${absences.teacherID}, 'timestamp', ${absences.timestamp}, 'date', ${absences.date}, 'reason', ${absences.reason}, 'value', ${absences.excused}))`
				})
				.from(absences)
				.where(eq(absences.studentID, userID))
				.groupBy(absences.subjectID)
		]);

		return { grades: gr, absences: ab };
	}

	async getSubjectObjectsStudent(subjectID: number, userID: number) {
		const [gr, ab] = await Promise.all([
			this.db
				.select({
					id: grades.id,
					reason: grades.reason,
					teacherID: grades.teacherID,
					value: grades.value,
					timestamp: grades.timestamp,
					date: grades.date
				})
				.from(grades)
				.where(
					and(eq(grades.studentID, userID), eq(grades.subjectID, subjectID))
				),
			this.db
				.select({
					id: absences.id,
					reason: absences.reason,
					teacherID: absences.teacherID,
					value: absences.excused,
					timestamp: absences.timestamp,
					date: absences.date
				})
				.from(absences)
				.where(
					and(eq(absences.studentID, userID), eq(absences.subjectID, subjectID))
				)
		]);

		return { grades: gr, absences: ab };
	}

	async update(
		updateGradeDto: UpdateGradeDto,
		gradeID: number,
		teacherID: number
	) {
		await this.db
			.update(grades)
			.set({
				reason: updateGradeDto.reason,
				value: updateGradeDto.value
			})
			.where(and(eq(grades.id, gradeID), eq(grades.teacherID, teacherID)));
	}

	async remove(deleteByIdDto: DeleteByIdDto, teacherID: number) {
		await this.db
			.delete(grades)
			.where(
				and(
					inArray(grades.id, deleteByIdDto.objects),
					eq(grades.teacherID, teacherID)
				)
			);
	}
}
