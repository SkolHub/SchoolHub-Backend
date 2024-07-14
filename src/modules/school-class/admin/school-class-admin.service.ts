import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { CreateSchoolClassesDto } from './dto/create-school-classes.dto';
import { schoolClasses } from '../../../database/schema/school-classes';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';
import { studentsToSchoolClasses } from '../../../database/schema/students-to-school-classes';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { subjectsToSchoolClasses } from '../../../database/schema/subjects-to-school-classes';
import { LinkObjectsDto } from '../../../common/dto/link-objects.dto';
import { members } from '../../../database/schema/members';

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

	private async schoolClassesAndMembersInOrganization(
		schoolClassIDs: number[],
		memberIDs: number[],
		organizationID: number
	) {
		const schoolClassCount = (
			await this.db
				.select({
					count: count()
				})
				.from(schoolClasses)
				.where(
					and(
						inArray(schoolClasses.id, schoolClassIDs),
						eq(schoolClasses.organizationID, organizationID)
					)
				)
		)[0].count;

		const studentCount = (
			await this.db
				.select({
					count: count()
				})
				.from(members)
				.where(
					and(
						inArray(members.id, memberIDs),
						eq(members.organizationID, organizationID)
					)
				)
		)[0].count;

		if (schoolClassCount !== schoolClassIDs.length) {
			throw new ForbiddenException(
				'Your organization does not include all of the given school classes'
			);
		}

		if (studentCount !== memberIDs.length) {
			throw new ForbiddenException(
				'Your organization does not include all of the given members'
			);
		}
	}

	private async validateLink(linkObjectsDto: LinkObjectsDto) {
		await this.schoolClassesAndMembersInOrganization(
			linkObjectsDto.links.map((schoolClass) => schoolClass.mainID),
			[
				...new Set(
					linkObjectsDto.links.map((schoolClass) => schoolClass.objects).flat()
				)
			],
			this.organizationID
		);
	}

	async addStudents(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		await this.db.insert(studentsToSchoolClasses).values(
			linkObjectsDto.links
				.map((schoolClass) =>
					schoolClass.objects.map((member) => ({
						studentID: member,
						schoolClassID: schoolClass.mainID
					}))
				)
				.flat()
		);
	}

	async addSubjects(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		await this.db.insert(subjectsToSchoolClasses).values(
			linkObjectsDto.links
				.map((schoolClass) =>
					schoolClass.objects.map((subject) => ({
						subjectID: subject,
						schoolClassID: schoolClass.mainID
					}))
				)
				.flat()
		);
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

	async removeStudents(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		return this.db
			.delete(studentsToSchoolClasses)
			.where(
				sql`(${studentsToSchoolClasses.studentID}, ${studentsToSchoolClasses.schoolClassID})
                    IN
                    ( ${linkObjectsDto.links
											.map((schoolClass) =>
												schoolClass.objects.map((member) => [
													member,
													schoolClass.mainID
												])
											)
											.flat()})`
			)
			.toSQL();
	}

	async removeSubjects(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		return this.db.delete(subjectsToSchoolClasses).where(
			sql`(${subjectsToSchoolClasses.subjectID}, ${subjectsToSchoolClasses.schoolClassID})
                IN
                ( ${linkObjectsDto.links
									.map((schoolClass) =>
										schoolClass.objects.map((subject) => [
											subject,
											schoolClass.mainID
										])
									)
									.flat()})`
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
}
