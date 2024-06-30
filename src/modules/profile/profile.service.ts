import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DBService } from '../../common/db.service';

@Injectable()
export class ProfileService extends DBService {
	changePassword(changePasswordDto: ChangePasswordDto) {}
}
