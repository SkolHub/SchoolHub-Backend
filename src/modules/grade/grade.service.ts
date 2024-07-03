import { ForbiddenException, Injectable } from '@nestjs/common';
import { and, count, eq, inArray } from 'drizzle-orm';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';
import { DBService } from '../../common/db.service';
import { CreateGradesDto } from './dto/create-grades.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { DeleteGradesDto } from './dto/delete-grades.dto';
import { grades } from '../../database/schema/grades';

@Injectable()
export class GradeService extends DBService {
	async create(createGradesDto: CreateGradesDto, teacherID: number) {
		const [teacher, students] = await Promise.all([
			this.db
				.select({
					count: count()
				})
				.from(teachersToSubjects)
				.where(
					and(
						eq(teachersToSubjects.teacherID, teacherID),
						eq(teachersToSubjects.subjectID, createGradesDto.subjectID)
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
							createGradesDto.grades.map((grade) => grade.studentID)
						),
						eq(studentsToSubjects.subjectID, createGradesDto.subjectID)
					)
				)
		]);

		if (!teacher[0].count) {
			throw new ForbiddenException('You are not a teacher in this subject');
		}

		if (students.length !== createGradesDto.grades.length) {
			throw new ForbiddenException("Students don't belong to this class");
		}

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

	findOne(gradeID: number, teacherID: number) {
		return this.db
			.select({
				date: grades.date,
				reason: grades.reason,
				studentID: grades.studentID,
				teacherID: grades.teacherID,
				subjectID: grades.subjectID,
				timestamp: grades.timestamp,
				id: grades.id
			})
			.from(grades)
			.innerJoin(
				teachersToSubjects,
				and(
					eq(teachersToSubjects.subjectID, grades.subjectID),
					eq(teachersToSubjects.teacherID, teacherID)
				)
			)
			.where(eq(grades.id, gradeID));
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

	async remove(deleteGradesDto: DeleteGradesDto, teacherID: number) {
		await this.db
			.delete(grades)
			.where(
				and(
					inArray(grades.id, deleteGradesDto.grades),
					eq(grades.teacherID, teacherID)
				)
			);
	}
}
