import { Injectable } from '@nestjs/common';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { DBService } from '../../common/db.service';
import { observations } from '../../database/schema/observations';

@Injectable()
export class ObservationService extends DBService {
	async create(createObservationDto: CreateObservationsDto, teacherID: number) {


		await this.db.insert(observations).values({
			reason: createObservationDto.reason,
			studentID: createObservationDto.studentID,
			subjectID: createObservationDto.subjectID,
			teacherID
		});
	}

	findAll() {
		return `This action returns all observation`;
	}

	findOne(id: number) {
		return `This action returns a #${id} observation`;
	}

	update(id: number, updateObservationDto: UpdateObservationDto) {
		return `This action updates a #${id} observation`;
	}

	remove(id: number) {
		return `This action removes a #${id} observation`;
	}
}
