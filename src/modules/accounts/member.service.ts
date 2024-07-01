import { DBService } from '../../common/db.service';
import { members } from '../../database/schema/members/members';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { AddTaggedAccountsDto } from './dto/add-tagged-accounts.dto';
import { tagged } from '../../database/schema/members/tagged';
import { DeleteAccountsDto } from './dto/delete-accounts.dto';
import { AddParentAccountsDto } from './dto/add-parent-accounts.dto';
import { parents } from '../../database/schema/members/parents';
import { UpdateTaggedDto } from './dto/update-tagged.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

export class MemberService extends DBService {
	async createTagged(
		addTaggedAccountsDto: AddTaggedAccountsDto,
		role: 'teacher' | 'student',
		organizationID: number
	) {
		const accounts = await this.db
			.insert(members)
			.values(
				addTaggedAccountsDto.accounts.map((account) => ({
					organizationID,
					role: role,
					name: account.displayName,
					username: account.username,
					password: account.password
				}))
			)
			.returning({
				id: members.id
			});

		await this.db.insert(tagged).values(
			accounts.map((account, index) => ({
				memberID: account.id,
				tags: addTaggedAccountsDto.accounts[index].tags,
				organizationID
			}))
		);
	}

	async createParents(
		addParentAccounts: AddParentAccountsDto,
		organizationID: number
	) {
		const accounts = await this.db
			.insert(members)
			.values(
				addParentAccounts.accounts.map((account) => ({
					organizationID,
					role: 'parent' as 'parent',
					name: account.displayName,
					username: account.username,
					password: account.password
				}))
			)
			.returning({
				id: members.id
			});

		await this.db.insert(parents).values(
			accounts.map((account, index) => ({
				studentID: addParentAccounts.accounts[index].studentID,
				memberID: account.id
			}))
		);
	}

	findAll(role: 'teacher' | 'student' | 'parent', organizationID: number) {
		return this.db
			.select()
			.from(members)
			.where(
				and(eq(members.organizationID, organizationID), eq(members.role, role))
			);
	}

	async updateAccount(
		updateAccountDto: UpdateAccountDto,
		id: number,
		organizationID: number
	) {
		await this.db
			.update(members)
			.set({
				name: updateAccountDto.displayName
			})
			.where(
				and(
					eq(members.id, id),
					eq(members.organizationID, organizationID),
					ne(members.role, 'admin')
				)
			);
	}

	async updateTags(
		updateTaggedDto: UpdateTaggedDto,
		id: number,
		organizationID: number
	) {
		await this.db
			.update(tagged)
			.set({
				tags: updateTaggedDto.tags
			})
			.where(
				and(eq(tagged.memberID, id), eq(tagged.organizationID, organizationID))
			);
	}

	async remove(deleteAccountsDto: DeleteAccountsDto, organizationID: number) {
		await this.db
			.delete(members)
			.where(
				and(
					inArray(members.id, deleteAccountsDto.accounts),
					eq(members.organizationID, organizationID),
					ne(members.role, 'admin')
				)
			);
	}
}
