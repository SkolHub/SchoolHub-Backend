import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import config from './core/config';
import { ClsModule } from 'nestjs-cls';
import * as schema from './core/schema';

@Module({
	imports: [
		DrizzlePGModule.register({
			tag: 'DB',
			config: { schema: { ...schema } },
			pg: {
				connection: 'client',
				config: {
					connectionString: config.DB_URL
				}
			}
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true
			}
		})
	]
})
export class AppModule {}
