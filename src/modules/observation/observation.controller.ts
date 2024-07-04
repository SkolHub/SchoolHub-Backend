import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Session
} from '@nestjs/common';
import { ObservationService } from './observation.service';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { RawMemberSession } from '../../types/session';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

@Controller()
export class ObservationController {
	constructor(private readonly observationService: ObservationService) {}

	@Post()
	create(
		@Body() createObservationsDto: CreateObservationsDto,
		@Session() session: RawMemberSession
	) {
		return this.observationService.create(
			createObservationsDto,
			session.passport.user.userID
		);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateObservationDto: UpdateObservationDto,
		@Session() session: RawMemberSession
	) {
		return this.observationService.update(
			updateObservationDto,
			id,
			session.passport.user.userID
		);
	}

	@Delete()
	remove(
		@Body() deleteByIdDto: DeleteByIdDto,
		@Session() session: RawMemberSession
	) {
		return this.observationService.remove(
			deleteByIdDto,
			session.passport.user.userID
		);
	}
}
