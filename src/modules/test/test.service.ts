import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { members } from '../../database/schema/members';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { organizations } from '../../database/schema/organizations';
import { subjects } from '../../database/schema/subjects';
import { schoolClasses } from '../../database/schema/school-classes';
import { subjectsToSchoolClasses } from '../../database/schema/subjects-to-school-classes';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';
import { studentsToSchoolClasses } from '../../database/schema/students-to-school-classes';
import { sql } from 'drizzle-orm';
import { studentsToSubjects } from '../../database/schema/students-to-subjects';

@Injectable()
export class TestService extends DBService {
	private readonly admins = [
		{
			name: 'Admin 1',
			password: 'Test123!',
			user: 'admin1'
		},
		{
			name: 'Admin 2',
			password: 'Test123!',
			user: 'admin2'
		},
		{
			name: 'Admin 3',
			password: 'Test123!',
			user: 'admin3'
		}
	];

	private readonly schoolClasses = ['9', '10', '11', '12']
		.map((year) =>
			['A', 'B', 'C', 'D', 'E', 'F'].map((group) => `${year} ${group}`)
		)
		.flat();

	private readonly commonSubjects = [
		'Informatică',
		'Biologie',
		'Chimie',
		'Fizică',
		'Geografie',
		'Matematică',
		'Istorie',
		'Limba și literatura română',
		'Religie',
		'Limba engleză'
	];

	private readonly subjects_9_10 = [
		'Educație plastică',
		'Educație muzicală',
		'TIC'
	];

	private readonly subjects_9 = ['Logică'];

	private readonly subjects_10 = ['Educație antreprenorială', 'Psihologie'];

	private readonly class_joins = [
		{
			subject: 'Germană',
			common_classes: [
				['9 A', '9 D'],
				['10 A', '10 D'],
				['11 A', '11 D'],
				['12 A', '12 D'],
				['9 B', '9 C'],
				['10 B', '10 C'],
				['11 B', '11 C'],
				['12 B', '12 C'],
				['9 E'],
				['10 E'],
				['11 E'],
				['12 E']
			]
		},
		{
			subject: 'Franceză',
			common_classes: [
				['9 A', '9 D'],
				['10 A', '10 D'],
				['11 A', '11 D'],
				['12 A', '12 D'],
				['9 B', '9 C'],
				['10 B', '10 C'],
				['11 B', '11 C'],
				['12 B', '12 C'],
				['9 F'],
				['10 F'],
				['11 F'],
				['12 F']
			]
		}
	];

	private readonly students = this.schoolClasses.map((schoolClass) =>
		Array.from({ length: 30 }).map((el, index) => ({
			name: `Student ${index} - ${schoolClass}`,
			user: `s${index}-${schoolClass.toLowerCase()}`,
			password: 'Test123!'
		}))
	);

	private readonly joined_subjects = this.class_joins
		.map((subject) =>
			subject.common_classes.map((schoolClassGroup) => ({
				name: subject.subject,
				schoolClasses: schoolClassGroup
			}))
		)
		.flat();

	private readonly generated_subjects = [
		...this.schoolClasses
			.map((schoolClass) =>
				this.commonSubjects.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('9') || sc.includes('10'))
			.map((schoolClass) =>
				this.subjects_9_10.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('9'))
			.map((schoolClass) =>
				this.subjects_9.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat(),
		...this.schoolClasses
			.filter((sc) => sc.includes('10'))
			.map((schoolClass) =>
				this.subjects_10.map((subject) => ({
					name: subject,
					schoolClass: schoolClass
				}))
			)
			.flat()
	];

	private splitIntoMatrix<T>(arr: T[], size: number): T[][] {
		const matrix = [];

		for (let i = 0; i < arr.length; i += size) {
			matrix.push(arr.slice(i, i + size));
		}

		return matrix;
	}

	private splitArrayIntoParts<T>(array: T[], n: number): T[][] {
		const result = [];
		const partSize = Math.ceil(array.length / n);

		for (let i = 0; i < n; i++) {
			const start = i * partSize;
			const end = start + partSize;
			const part = array.slice(start, end);
			result.push(part);
		}

		return result;
	}

	async generateDummyData() {
		const [owner] = await this.db
			.insert(members)
			.values({
				name: 'admin',
				password: await BcryptUtils.hashPassword('Test123!'),
				user: 'admin@cnibv.com',
				role: 'admin'
			})
			.returning({
				id: members.id
			});

		const [organization] = await this.db
			.insert(organizations)
			.values({
				name: 'CNIBV',
				ownerID: owner.id
			})
			.returning({
				id: organizations.id
			});

		await this.db.update(members).set({
			organizationID: organization.id
		});

		await this.db.insert(members).values(
			await Promise.all(
				this.admins.map(async (admin) => ({
					organizationID: organization.id,
					role: 'admin' as 'admin',
					name: admin.name,
					user: admin.user,
					password: await BcryptUtils.hashPassword(admin.password)
				}))
			)
		);

		const st = await this.db
			.insert(members)
			.values(
				await Promise.all(
					this.students.flat().map(async (student) => ({
						organizationID: organization.id,
						role: 'student' as 'student',
						name: student.name,
						user: student.user,
						password: await BcryptUtils.hashPassword(student.password)
					}))
				)
			)
			.returning({ id: members.id });

		const sc = await this.db
			.insert(schoolClasses)
			.values(
				this.schoolClasses.map((schoolClass) => ({
					organizationID: organization.id,
					name: schoolClass
				}))
			)
			.returning();

		const s = await this.db
			.insert(subjects)
			.values(
				this.generated_subjects.map((subject) => ({
					organizationID: organization.id,
					name: subject.name,
					icon: 'leaf',
					metadata: {
						minGrades: 5
					}
				}))
			)
			.returning();

		const split_students = this.splitIntoMatrix(st, 30);

		await this.db.insert(studentsToSchoolClasses).values(
			split_students
				.map((students, index) =>
					students.map((student) => ({
						studentID: student.id,
						schoolClassID: sc[index].id
					}))
				)
				.flat()
		);

		await this.db.insert(subjectsToSchoolClasses).values(
			s.map((subject, index) => ({
				subjectID: subject.id,
				schoolClassID: sc.find(
					(schoolClass) =>
						schoolClass.name === this.generated_subjects[index].schoolClass
				).id
			}))
		);

		const js = await this.db
			.insert(subjects)
			.values(
				this.joined_subjects.map((subject) => ({
					name: subject.name,
					organizationID: organization.id,
					icon: 'leaf',
					metadata: {
						minGrades: 5
					}
				}))
			)
			.returning();

		await this.db.insert(subjectsToSchoolClasses).values(
			this.joined_subjects
				.map((subject, subjectIndex) =>
					subject.schoolClasses.map((schoolClass) => ({
						subjectID: js[subjectIndex].id,
						schoolClassID: sc.find((el) => el.name === schoolClass).id
					}))
				)
				.flat()
		);

		const unique_subjects = await this.db
			.select({
				name: subjects.name
			})
			.from(subjects)
			.groupBy(subjects.name);

		const teachers = await this.db
			.insert(members)
			.values(
				await Promise.all(
					unique_subjects.map(async (subject, index) => ({
						name: `${subject.name} teacher`,
						user: `t${index}`,
						password: await BcryptUtils.hashPassword('Test123!'),
						organizationID: organization.id,
						role: 'teacher' as 'teacher'
					}))
				)
			)
			.returning({ id: members.id });

		const total_subjects = await this.db.select().from(subjects);

		await this.db.insert(teachersToSubjects).values(
			total_subjects.map((subject) => ({
				teacherID:
					teachers[
						unique_subjects.findIndex((sub) => sub.name === subject.name)
					].id,
				subjectID: subject.id
			}))
		);

		const extra_teacher = await this.db
			.insert(members)
			.values({
				name: `${this.commonSubjects[0]} teacher 2`,
				user: `t${unique_subjects.length}`,
				password: await BcryptUtils.hashPassword('Test123!'),
				organizationID: organization.id,
				role: 'teacher' as 'teacher'
			})
			.returning({ id: members.id });

		await this.db.insert(teachersToSubjects).values(
			total_subjects
				.filter((subject) => subject.name === this.commonSubjects[0])
				.map((subject) => ({
					teacherID: extra_teacher[0].id,
					subjectID: subject.id
				}))
		);

		const studentSubjectLinks: {
			students: {
				id: number;
				name: string;
			}[];
			subjects: {
				id: number;
				name: string;
			}[];
		}[] = (
			await this.db.execute(sql`
                SELECT ${schoolClasses.name},
                       ${schoolClasses.id},
                       (SELECT json_agg(json_build_object('id', ${members.id}, 'name', ${members.name}))
                        FROM ${studentsToSchoolClasses}
                                 INNER JOIN ${members} ON ${members.id} = ${studentsToSchoolClasses.studentID} AND ${members.role} = 'student'
                        WHERE ${studentsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as students,

                       (SELECT json_agg(json_build_object('id', ${subjects.id}, 'name', ${subjects.name}))
                        FROM ${subjectsToSchoolClasses}
                                 INNER JOIN ${subjects} ON ${subjects.id} = ${subjectsToSchoolClasses.subjectID} AND NOT ${subjects.name} IN ${this.class_joins.map((join) => join.subject)}
                        WHERE ${subjectsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as subjects
                FROM ${schoolClasses}
                WHERE ${schoolClasses.organizationID} = ${organization.id};
            `)
		).rows;

		console.log(studentSubjectLinks);

		await this.db.insert(studentsToSubjects).values(
			studentSubjectLinks
				.map((schoolClass) =>
					schoolClass.students.map((student) =>
						schoolClass.subjects.map((subject) => ({
							studentID: student.id,
							subjectID: subject.id
						}))
					)
				)
				.flat(2)
		);

		const specialStudentSubjectLinks: {
			students: {
				id: number;
				name: string;
			}[];
			subjects: {
				id: number;
				name: string;
			}[];
		}[] = (
			await this.db.execute(sql`
                SELECT ${schoolClasses.name},
                       ${schoolClasses.id},
                       (SELECT json_agg(json_build_object('id', ${members.id}, 'name', ${members.name}))
                        FROM ${studentsToSchoolClasses}
                                 INNER JOIN ${members} ON ${members.id} = ${studentsToSchoolClasses.studentID} AND ${members.role} = 'student'
                        WHERE ${studentsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as students,

                       (SELECT json_agg(json_build_object('id', ${subjects.id}, 'name', ${subjects.name}))
                        FROM ${subjectsToSchoolClasses}
                                 INNER JOIN ${subjects} ON ${subjects.id} = ${subjectsToSchoolClasses.subjectID} AND ${subjects.name} IN ${this.class_joins.map((join) => join.subject)}
                        WHERE ${subjectsToSchoolClasses.schoolClassID} = ${schoolClasses.id}) as subjects
                FROM ${schoolClasses}
                WHERE ${schoolClasses.organizationID} = ${organization.id};
            `)
		).rows;

		await this.db.insert(studentsToSubjects).values(
			specialStudentSubjectLinks
				.map((schoolClass) =>
					this.splitArrayIntoParts(
						schoolClass.students,
						schoolClass.subjects.length
					).map((part, index) =>
						part.map((student) => ({
							studentID: student.id,
							subjectID: schoolClass.subjects[index].id
						}))
					)
				)
				.flat(2)
		);
	}
}
