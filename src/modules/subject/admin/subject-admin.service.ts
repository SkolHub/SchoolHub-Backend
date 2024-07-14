import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';
import { CreateSubjectsDto } from './dto/create-subjects.dto';
import { subjects } from '../../../database/schema/subjects';
import { and, count, eq, inArray, sql } from 'drizzle-orm';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { studentsToSubjects } from '../../../database/schema/students-to-subjects';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { members } from '../../../database/schema/members';
import { LinkObjectsDto } from '../../../common/dto/link-objects.dto';

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

	private async subjectsAndMembersInOrganization(
		subjectIDs: number[],
		memberIDs: number[],
		organizationID: number
	) {
		const subjectCount = (
			await this.db
				.select({
					count: count()
				})
				.from(subjects)
				.where(
					and(
						inArray(subjects.id, subjectIDs),
						eq(subjects.organizationID, organizationID)
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

		if (subjectCount !== subjectIDs.length) {
			throw new ForbiddenException(
				'Your organization does not include all of the given subjects'
			);
		}

		if (studentCount !== memberIDs.length) {
			throw new ForbiddenException(
				'Your organization does not include all of the given members'
			);
		}
	}

	private async validateLink(linkObjectsDto: LinkObjectsDto) {
		await this.subjectsAndMembersInOrganization(
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

		await this.db.insert(studentsToSubjects).values(
			linkObjectsDto.links
				.map((subject) =>
					subject.objects.map((student) => ({
						studentID: student,
						subjectID: subject.mainID
					}))
				)
				.flat()
		);
	}

	async addTeachers(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		await this.db.insert(teachersToSubjects).values(
			linkObjectsDto.links
				.map((subject) =>
					subject.objects.map((teacher) => ({
						teacherID: teacher,
						subjectID: subject.mainID
					}))
				)
				.flat()
		);
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

	async removeStudents(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		await this.db.delete(studentsToSubjects).where(
			sql`(${studentsToSubjects.studentID}, ${studentsToSubjects.subjectID})
                IN
                ( ${linkObjectsDto.links
									.map((subject) =>
										subject.objects.map((student) => [student, subject.mainID])
									)
									.flat()})`
		);
	}

	async removeTeachers(linkObjectsDto: LinkObjectsDto) {
		await this.validateLink(linkObjectsDto);

		await this.db.delete(teachersToSubjects).where(
			sql`(${teachersToSubjects.teacherID}, ${teachersToSubjects.subjectID})
                    IN
                    ( ${linkObjectsDto.links
											.map((subject) =>
												subject.objects.map((teacher) => [
													teacher,
													subject.mainID
												])
											)
											.flat()})`
		);
	}
}
