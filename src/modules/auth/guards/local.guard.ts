import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/*
    The guard used for the login endpoint; Uses the local strategy to validate the request and grant access
*/

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
