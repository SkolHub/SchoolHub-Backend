import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { subjects } from '../../../database/schema/subjects';
import { and, count, eq, inArray } from 'drizzle-orm';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AddMembersToSubjectDto } from './dto/add-members-to-subject.dto';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';

@Injectable()
export class SubjectAdminService extends DBService {
	async createMany(
		createSubjectsDto: CreateSubjectsDto,
		organizationID: number
	) {
		await this.db.insert(subjects).values(
			createSubjectsDto.subjects.map((subject) => ({
				name: subject.name,
				organizationID
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

	async addStudents(
		addMembersToSubjectDto: AddMembersToSubjectDto,
		organizationID: number
	) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			organizationID
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

	async addTeachers(
		addMembersToSubjectDto: AddMembersToSubjectDto,
		organizationID: number
	) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			organizationID
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

	findOne(organizationID: number, subjectID: number) {
		return this.db.query.subjects.findFirst({
			where: and(
				eq(subjects.id, subjectID),
				eq(subjects.organizationID, organizationID)
			),
			columns: {
				id: true,
				name: true
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

	findMany(organizationID: number) {
		return this.db.query.subjects.findMany({
			where: eq(subjects.organizationID, organizationID),
			columns: {
				id: true,
				name: true
			}
		});
	}

	async update(
		updateSubjectDto: UpdateSubjectDto,
		subjectID: number,
		organizationID: number
	) {
		await this.db
			.update(subjects)
			.set({
				name: updateSubjectDto.name
			})
			.where(
				and(
					eq(subjects.id, subjectID),
					eq(subjects.organizationID, organizationID)
				)
			);
	}

	async remove(deleteByIdDto: DeleteByIdDto, organizationID: number) {
		await this.db
			.delete(subjects)
			.where(
				and(
					inArray(subjects.id, deleteByIdDto.objects),
					eq(subjects.organizationID, organizationID)
				)
			);
	}

	async removeStudents(
		addMembersToSubjectDto: AddMembersToSubjectDto,
		organizationID: number
	) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			organizationID
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

	async removeTeachers(
		addMembersToSubjectDto: AddMembersToSubjectDto,
		organizationID: number
	) {
		const exists = await this.subjectExists(
			addMembersToSubjectDto.subjectID,
			organizationID
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
