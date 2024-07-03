import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	Session
} from '@nestjs/common';
import { ObservationService } from './observation.service';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { RawMemberSession } from '../../types/session';

@Controller()
export class ObservationController {
	constructor(private readonly observationService: ObservationService) {}

	@Post()
	create(
		@Body() createObservationDto: CreateObservationsDto,
		@Session() session: RawMemberSession
	) {
		return this.observationService.create(
			createObservationDto,
			session.passport.user.userID
		);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateObservationDto: UpdateObservationDto
	) {
		return this.observationService.update(+id, updateObservationDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.observationService.remove(+id);
	}
}
