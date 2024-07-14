import { Injectable } from '@nestjs/common';
import { DBService } from '../../../common/db.service';

@Injectable()
export class ParentGradeService extends DBService {}
