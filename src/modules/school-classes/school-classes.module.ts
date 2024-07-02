import { Module } from '@nestjs/common';
import { SchoolClassesService } from './school-classes.service';
import { SchoolClassesController } from './school-classes.controller';

@Module({
  controllers: [SchoolClassesController],
  providers: [SchoolClassesService],
})
export class SchoolClassesModule {}
