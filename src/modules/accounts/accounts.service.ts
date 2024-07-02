import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { AddMembersDto } from './dto/add-members.dto';
import { AddParentsDto } from './dto/add-parents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ResetPasswordMemberDto } from './dto/reset-password-member.dto';
import { RemoveMembersDto } from './dto/remove-members.dto';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { members } from '../../database/schema/members';
import { parents } from '../../database/schema/parents';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class AccountsService extends DBService {
	private async hashAccounts(
		addMembersDto: AddMembersDto,
		organizationID: number,
		role: 'student' | 'teacher' | 'parent'
	) {
		return Promise.all(
			addMembersDto.members.map(async (member) => ({
				organizationID,
				name: member.name,
				password: await BcryptUtils.hashPassword(member.password),
				user: member.user,
				role
			}))
		);
	}

	async addStudents(addMembersDto: AddMembersDto, organizationID: number) {
		await this.db
			.insert(members)
			.values(
				await this.hashAccounts(addMembersDto, organizationID, 'student')
			);
	}

	async addTeachers(addMembersDto: AddMembersDto, organizationID: number) {
		await this.db
			.insert(members)
			.values(
				await this.hashAccounts(addMembersDto, organizationID, 'teacher')
			);
	}

	async addParents(addParentsDto: AddParentsDto, organizationID: number) {
		const accounts = await this.db
			.insert(members)
			.values(await this.hashAccounts(addParentsDto, organizationID, 'student'))
			.returning({
				id: members.id
			});

		await this.db.insert(parents).values(
			accounts.map((account, index) => ({
				memberID: account.id,
				studentID: addParentsDto.members[index].studentID
			}))
		);
	}

	findOne(memberID: number, organizationID: number) {
		return this.db.query.members.findFirst({
			where: and(
				eq(members.id, memberID),
				eq(members.organizationID, organizationID)
			),
			columns: {
				name: true,
				role: true,
				user: true
			}
		});
	}

	private getMany(
		role: 'student' | 'teacher' | 'parent',
		organizationID: number
	) {
		return this.db.query.members.findMany({
			where: and(
				eq(members.organizationID, organizationID),
				eq(members.role, role)
			)
		});
	}

	getStudents(organizationID: number) {
		return this.getMany('student', organizationID);
	}

	getTeachers(organizationID: number) {
		return this.getMany('teacher', organizationID);
	}

	getParents(organizationID: number) {
		return this.getMany('parent', organizationID);
	}

	async update(
		updateMemberDto: UpdateMemberDto,
		memberID: number,
		organizationID: number
	) {
		await this.db
			.update(members)
			.set({
				name: updateMemberDto.name,
				user: updateMemberDto.user
			})
			.where(
				and(
					eq(members.id, memberID),
					eq(members.organizationID, organizationID)
				)
			);
	}

	async resetPassword(
		resetPasswordMemberDto: ResetPasswordMemberDto,
		memberID: number,
		organizationID: number
	) {
		await this.db
			.update(members)
			.set({
				password: await BcryptUtils.hashPassword(
					resetPasswordMemberDto.password
				)
			})
			.where(
				and(
					eq(members.id, memberID),
					eq(members.organizationID, organizationID)
				)
			);
	}

	async remove(removeMembersDto: RemoveMembersDto, organizationID: number) {
		await this.db
			.delete(members)
			.where(
				and(
					inArray(members.id, removeMembersDto.members),
					eq(members.organizationID, organizationID)
				)
			);
	}
}
