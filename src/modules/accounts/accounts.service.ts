import { Injectable } from '@nestjs/common';
import { DBService } from '../../common/db.service';
import { AddMembersDto } from './dto/add-members.dto';
import { AddParentsDto } from './dto/add-parents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ResetPasswordMemberDto } from './dto/reset-password-member.dto';
import { BcryptUtils } from '../../common/utils/bcrypt.utils';
import { members } from '../../database/schema/members';
import { parents } from '../../database/schema/parents';
import { and, eq, inArray } from 'drizzle-orm';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

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

	async addStudents(addMembersDto: AddMembersDto) {
		await this.db
			.insert(members)
			.values(
				await this.hashAccounts(addMembersDto, this.organizationID, 'student')
			);
	}

	async addTeachers(addMembersDto: AddMembersDto) {
		await this.db
			.insert(members)
			.values(
				await this.hashAccounts(addMembersDto, this.organizationID, 'teacher')
			);
	}

	async addParents(addParentsDto: AddParentsDto) {
		const accounts = await this.db
			.insert(members)
			.values(
				await this.hashAccounts(addParentsDto, this.organizationID, 'student')
			)
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

	findOne(memberID: number) {
		return this.db.query.members.findFirst({
			where: and(
				eq(members.id, memberID),
				eq(members.organizationID, this.organizationID)
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

	getStudents() {
		return this.getMany('student', this.organizationID);
	}

	getTeachers() {
		return this.getMany('teacher', this.organizationID);
	}

	getParents() {
		return this.getMany('parent', this.organizationID);
	}

	async update(updateMemberDto: UpdateMemberDto, memberID: number) {
		await this.db
			.update(members)
			.set({
				name: updateMemberDto.name,
				user: updateMemberDto.user
			})
			.where(
				and(
					eq(members.id, memberID),
					eq(members.organizationID, this.organizationID)
				)
			);
	}

	async resetPassword(
		resetPasswordMemberDto: ResetPasswordMemberDto,
		memberID: number
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
					eq(members.organizationID, this.organizationID)
				)
			);
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(members)
			.where(
				and(
					inArray(members.id, deleteByIdDto.objects),
					eq(members.organizationID, this.organizationID)
				)
			);
	}
}
