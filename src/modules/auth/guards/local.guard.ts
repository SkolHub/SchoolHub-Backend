import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
