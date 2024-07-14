import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';

@Injectable()
export class ParentAbsenceService extends DBService {}
