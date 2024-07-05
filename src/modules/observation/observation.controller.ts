import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Post
} from '@nestjs/common';
import { ObservationService } from './observation.service';
import { CreateObservationsDto } from './dto/create-observations.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { DeleteByIdDto } from '../../common/dto/delete-by-id.dto';

@Controller()
export class ObservationController {
	constructor(private readonly observationService: ObservationService) {}

	@Post()
	create(@Body() createObservationsDto: CreateObservationsDto) {
		return this.observationService.create(createObservationsDto);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateObservationDto: UpdateObservationDto
	) {
		return this.observationService.update(updateObservationDto, id);
	}

	@Delete()
	remove(@Body() deleteByIdDto: DeleteByIdDto) {
		return this.observationService.remove(deleteByIdDto);
	}
}
