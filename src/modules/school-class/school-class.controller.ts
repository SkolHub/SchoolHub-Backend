import { Controller } from '@nestjs/common';
import { SchoolClassService } from './school-class.service';

@Controller('school-class')
export class SchoolClassController {
  constructor(private readonly schoolClassService: SchoolClassService) {}
}
