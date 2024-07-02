import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { schoolClasses } from '../../database/schema/school-classes';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { DeleteSchoolClassesDto } from './dto/delete-school-classes.dto';

@Injectable()
export class SchoolClassesService extends DBService {
	async createMany(
		createSchoolClassesDto: CreateSchoolClassesDto,
		organizationID: number
	) {
		await this.db.insert(schoolClasses).values(
			createSchoolClassesDto.schoolClasses.map((schoolClass) => ({
				name: schoolClass.name,
				classMasterID: schoolClass.classMasterID,
				organizationID
			}))
		);
	}

	findOne(organizationID: number, schoolClassID: number) {
		return this.db.query.schoolClasses.findFirst({
			where: and(
				eq(schoolClasses.id, schoolClassID),
				eq(schoolClasses.organizationID, organizationID)
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

	findMany(organizationID: number) {
		return this.db.query.schoolClasses.findMany({
			where: eq(schoolClasses.organizationID, organizationID),
			columns: {
				id: true,
				name: true
			}
		});
	}

	async update(
		updateSchoolClassDto: UpdateSchoolClassDto,
		schoolClassID: number,
		organizationID: number
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
					eq(schoolClasses.organizationID, organizationID)
				)
			);
	}

	async removeMany(
		deleteSchoolClassesDto: DeleteSchoolClassesDto,
		organizationID: number
	) {
		await this.db
			.delete(schoolClasses)
			.where(
				and(
					inArray(schoolClasses.id, deleteSchoolClassesDto.schoolClasses),
					eq(schoolClasses.organizationID, organizationID)
				)
			);
	}
}
