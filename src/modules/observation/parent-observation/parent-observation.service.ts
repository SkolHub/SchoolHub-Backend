import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';

@Injectable()
export class ParentObservationService extends DBService {}
