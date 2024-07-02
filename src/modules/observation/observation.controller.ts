import { Controller } from '@nestjs/common';
import { ObservationService } from './observation.service';

@Controller('observation')
export class ObservationController {
  constructor(private readonly observationService: ObservationService) {}
}
