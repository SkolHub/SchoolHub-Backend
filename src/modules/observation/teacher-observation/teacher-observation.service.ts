import { Injectable } from '@nestjs/common';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { DBService } from '../../../common/db.service';
import { observations } from '../../../database/schema/observations';
import { PermissionService } from '../../../common/permission.service';
import { and, eq, inArray } from 'drizzle-orm';
import { DeleteByIdDto } from '../../../common/dto/delete-by-id.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { teachersToSubjects } from '../../../database/schema/teachers-to-subjects';

@Injectable()
export class TeacherObservationService extends DBService {
	constructor(private readonly permissionService: PermissionService) {
		super();
	}

	async create(createObservationsDto: CreateObservationsDto) {
		await this.permissionService.canAssignObject(
			this.userID,
			createObservationsDto.observations.map(
				(observation) => observation.studentID
			),
			createObservationsDto.subjectID
		);

		await this.db.insert(observations).values(
			createObservationsDto.observations.map((observation) => ({
				reason: observation.reason,
				studentID: observation.studentID,
				subjectID: createObservationsDto.subjectID,
				teacherID: this.userID
			}))
		);
	}

	async getStudentObservations(subjectID: number, studentID: number) {
		return this.db
			.select({
				id: observations.id,
				reason: observations.reason,
				timestamp: observations.timestamp,
				teacherID: observations.teacherID
			})
			.from(teachersToSubjects)
			.innerJoin(
				observations,
				and(
					eq(observations.subjectID, subjectID),
					eq(observations.studentID, studentID)
				)
			)
			.where(
				and(
					eq(teachersToSubjects.teacherID, this.userID),
					eq(teachersToSubjects.subjectID, subjectID)
				)
			);
	}

	async update(
		updateObservationDto: UpdateObservationDto,
		observationID: number
	) {
		await this.db
			.update(observations)
			.set({
				reason: updateObservationDto.reason
			})
			.where(
				and(
					eq(observations.id, observationID),
					eq(observations.teacherID, this.userID)
				)
			);
	}

	async remove(deleteByIdDto: DeleteByIdDto) {
		await this.db
			.delete(observations)
			.where(
				and(
					inArray(observations.id, deleteByIdDto.objects),
					eq(observations.teacherID, this.userID)
				)
			);
	}
}
