import { Controller } from '@nestjs/common';
import { SchoolClassesService } from './school-classes.service';

@Controller('school-classes')
export class SchoolClassesController {
  constructor(private readonly schoolClassesService: SchoolClassesService) {}
}
