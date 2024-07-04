import { Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { DBService } from '../../common/db.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { grades } from '../../database/schema/grades';
import { PermissionService } from '../../common/permission.service';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

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
				.select({})
				.from(grades)
				.where(eq(grades.studentID, userID))
				.groupBy(grades.subjectID)
		]);
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
