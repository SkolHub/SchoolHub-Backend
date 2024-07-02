import { Controller } from '@nestjs/common';
import { AbsenceService } from './absence.service';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}
}
