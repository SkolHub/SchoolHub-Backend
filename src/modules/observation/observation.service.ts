import { Injectable } from '@nestjs/common';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { DBService } from '../../common/db.service';
import { observations } from '../../database/schema/observations';
import { grades } from '../../database/schema/grades';
import { PermissionService } from '../../common/permission.service';
import { and, eq, inArray } from 'drizzle-orm';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';

@Injectable()
export class ObservationService extends DBService {
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
			.delete(grades)
			.where(
				and(
					inArray(grades.id, deleteByIdDto.objects),
					eq(grades.teacherID, this.userID)
				)
			);
	}
}
