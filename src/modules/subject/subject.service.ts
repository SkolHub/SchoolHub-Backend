import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { subjects } from '../../database/schema/subjects';
import { and, eq, inArray } from 'drizzle-orm';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { DeleteSubjectsDto } from './dto/delete-subjects.dto';

@Injectable()
export class SubjectService extends DBService {
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

	async removeMany(
		deleteSubjectsDto: DeleteSubjectsDto,
		organizationID: number
	) {
		await this.db
			.delete(subjects)
			.where(
				and(
					inArray(subjects.id, deleteSubjectsDto.subjects),
					eq(subjects.organizationID, organizationID)
				)
			);
	}
}
