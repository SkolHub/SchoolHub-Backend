import {Controller, Post, UseGuards} from '@nestjs/common';
import { SchoolClassService } from './school-class.service';
import { AdminGuard } from '../../shared/guards/admin.guard';

@Controller('school-class')
@UseGuards(AdminGuard)
export class SchoolClassController {
	constructor(private readonly schoolClassService: SchoolClassService) {}

	@Post()
	create() {

	}
}
