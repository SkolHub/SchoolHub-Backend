import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { subjects } from '../../../database/schema/subjects';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AddMembersToSubjectDto } from './dto/add-members-to-subject.dto';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';

@Injectable()
export class SubjectAdminService extends DBService {
	async createMany(createSubjectsDto: CreateSubjectsDto) {
		await this.db.insert(subjects).values(
			createSubjectsDto.subjects.map((subject) => ({
				name: subject.name,
				organizationID: this.organizationID,
				icon: subject.icon,
				metadata: {
					minGrades: subject.minGrades
				}
			}))
		);
	}

	private subjectExists(subjectID: number, organizationID: number) {
		return this.db
			.select({
				exists: count()
			})
			.from(subjects)
			.where(
				and(
					eq(subjects.id, subjectID),
					eq(subjects.organizationID, organizationID)
				)
			);
	}

	async addStudents(addMembersToSubjectDto: AddMembersToSubjectDto) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db.insert(studentsToSubjects).values(
				addMembersToSubjectDto.members.map((member) => ({
					studentID: member,
					subjectID: addMembersToSubjectDto.subjectID
				}))
			);
		}
	}

	async addTeachers(addMembersToSubjectDto: AddMembersToSubjectDto) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db.insert(teachersToSubjects).values(
				addMembersToSubjectDto.members.map((member) => ({
					teacherID: member,
					subjectID: addMembersToSubjectDto.subjectID
				}))
			);
		}
	}

	findOne(subjectID: number) {
		return this.db.query.subjects.findFirst({
			where: and(
				eq(subjects.id, subjectID),
				eq(subjects.organizationID, this.organizationID)
			),
			columns: {
				id: true,
				name: true,
				icon: true,
				metadata: true
			},
			with: {
				teachers: {
					with: {
						teacher: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				},
				students: {
					with: {
						student: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				},
				schoolClasses: {
					with: {
						schoolClass: {
							columns: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});
	}

	findMany() {
		return this.db.query.subjects.findMany({
			where: eq(subjects.organizationID, this.organizationID),
			columns: {
				id: true,
				name: true,
				icon: true,
				metadata: true
			}
		});
	}

	async update(updateSubjectDto: UpdateSubjectDto, subjectID: number) {
		await this.db
			.update(subjects)
			.set({
				name: updateSubjectDto.name,
				icon: updateSubjectDto.icon,
				metadata: updateSubjectDto.minGrades
					? sql`jsonb_set
                            (${subjects.metadata}, array ['minGrades'], to_jsonb(${updateSubjectDto.minGrades}))`
					: undefined
			})
			.where(
				and(
					eq(subjects.id, subjectID),
					eq(subjects.organizationID, this.organizationID)
				)
			);
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(subjects)
			.where(
				and(
					inArray(subjects.id, deleteByIdDto.objects),
					eq(subjects.organizationID, this.organizationID)
				)
			);
	}

	async removeStudents(addMembersToSubjectDto: AddMembersToSubjectDto) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db
				.delete(studentsToSubjects)
				.where(
					and(
						inArray(
							studentsToSubjects.studentID,
							addMembersToSubjectDto.members
						),
						eq(studentsToSubjects.subjectID, addMembersToSubjectDto.subjectID)
					)
				);
		}
	}

	async removeTeachers(addMembersToSubjectDto: AddMembersToSubjectDto) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db
				.delete(teachersToSubjects)
				.where(
					and(
						inArray(
							teachersToSubjects.teacherID,
							addMembersToSubjectDto.members
						),
						eq(teachersToSubjects.subjectID, addMembersToSubjectDto.subjectID)
					)
				);
		}
	}
}
