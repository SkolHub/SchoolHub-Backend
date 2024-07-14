import { Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { DBService } from '../../../common/db.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { grades } from '../../../database/schema/grades';
import { PermissionService } from '../../../common/permission.service';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';

@Injectable()
export class TeacherGradeService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createGradesDto: CreateGradesDto) {
		await this.permissionService.canAssignObject(
			this.userID,
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
				teacherID: this.userID
			}))
		);
	}

	async getStudentGrades(subjectID: number, studentID: number) {
		return this.db
			.select({
				id: grades.id,
				reason: grades.reason,
				date: grades.date,
				timestamp: grades.timestamp,
				teacherID: grades.teacherID,
				value: grades.value
			})
			.from(teachersToSubjects)
			.innerJoin(
				grades,
				and(eq(grades.subjectID, subjectID), eq(grades.studentID, studentID))
			)
			.where(
				and(
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			);
	}

	async update(updateGradeDto: UpdateGradeDto, gradeID: number) {
		await this.db
			.update(grades)
			.set({
				reason: updateGradeDto.reason,
				value: updateGradeDto.value
			})
			.where(and(eq(grades.id, gradeID), eq(grades.teacherID, this.userID)));
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(grades)
			.where(
				and(
					inArray(grades.id, deleteByIdDto.objects),
					eq(grades.teacherID, this.userID)
				)
			);
	}
}
