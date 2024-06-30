import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { organizations } from '../../database/schema/organizations';
import { eq } from 'drizzle-orm';
import { DBService } from '../../common/db.service';

@Injectable()
export class OwnerGuard extends DBService implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const organization = await this.db.query.organizations.findFirst({
			where: eq(organizations.id, request.user.organizationID),
			columns: {
				ownerID: true
			}
		});

		return organization.ownerID === request.user.userID;
	}
}
