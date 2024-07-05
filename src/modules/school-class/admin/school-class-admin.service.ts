import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, count, eq, inArray } from 'drizzle-orm';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { schoolClasses } from '../../../database/schema/school-classes';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { AddMembersToSchoolClassDto } from './dto/add-members-to-school-class.dto';
import { studentsToSchoolClasses } from '../../../database/schema/students-to-school-classes';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';

@Injectable()
export class SchoolClassAdminService extends DBService {
	async createMany(createSchoolClassesDto: CreateSchoolClassesDto) {
		await this.db.insert(schoolClasses).values(
			createSchoolClassesDto.schoolClasses.map((schoolClass) => ({
				name: schoolClass.name,
				classMasterID: schoolClass.classMasterID,
				organizationID: this.organizationID
			}))
		);
	}

	private schoolClassExists(schoolClassID: number, organizationID: number) {
		return this.db
			.select({
				exists: count()
			})
			.from(schoolClasses)
			.where(
				and(
					eq(schoolClasses.id, schoolClassID),
					eq(schoolClasses.organizationID, organizationID)
				)
			);
	}

	async addStudents(addMembersToSchoolClassDto: AddMembersToSchoolClassDto) {
		const exists = await this.schoolClassExists(
			addMembersToSchoolClassDto.schoolClassID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db.insert(studentsToSchoolClasses).values(
				addMembersToSchoolClassDto.members.map((member) => ({
					studentID: member,
					schoolClassID: addMembersToSchoolClassDto.schoolClassID
				}))
			);
		}
	}

	findOne(schoolClassID: number) {
		return this.db.query.schoolClasses.findFirst({
			where: and(
				eq(schoolClasses.id, schoolClassID),
				eq(schoolClasses.organizationID, this.organizationID)
			),
			columns: {
				id: true,
				name: true
			},
			with: {
				classMaster: {
					columns: {
						id: true,
						name: true
					}
				},
				subjects: {
					with: {
						subject: {
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
				}
			}
		});
	}

	findMany() {
		return this.db.query.schoolClasses.findMany({
			where: eq(schoolClasses.organizationID, this.organizationID),
			columns: {
				id: true,
				name: true
			}
		});
	}

	async update(
		updateSchoolClassDto: UpdateSchoolClassDto,
		schoolClassID: number
	) {
		await this.db
			.update(schoolClasses)
			.set({
				name: updateSchoolClassDto.name,
				classMasterID: updateSchoolClassDto.classMasterID
			})
			.where(
				and(
					eq(schoolClasses.id, schoolClassID),
					eq(schoolClasses.organizationID, this.organizationID)
				)
			);
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(schoolClasses)
			.where(
				and(
					inArray(schoolClasses.id, deleteByIdDto.objects),
					eq(schoolClasses.organizationID, this.organizationID)
				)
			);
	}

	async removeStudents(addMembersToSchoolClassDto: AddMembersToSchoolClassDto) {
		const exists = await this.schoolClassExists(
			addMembersToSchoolClassDto.schoolClassID,
			this.organizationID
		);

		if (exists[0].exists) {
			await this.db
				.delete(studentsToSchoolClasses)
				.where(
					and(
						inArray(
							studentsToSchoolClasses.studentID,
							addMembersToSchoolClassDto.members
						),
						eq(
							studentsToSchoolClasses.schoolClassID,
							addMembersToSchoolClassDto.schoolClassID
						)
					)
				);
		}
	}
}
