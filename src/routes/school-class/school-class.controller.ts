import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchoolClassService } from './school-class.service';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';

@Controller('school-class')
export class SchoolClassController {
  constructor(private readonly schoolClassService: SchoolClassService) {}

  @Post()
  create(@Body() createSchoolClassDto: CreateSchoolClassDto) {
    return this.schoolClassService.create(createSchoolClassDto);
  }

  @Get()
  findAll() {
    return this.schoolClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolClassDto: UpdateSchoolClassDto) {
    return this.schoolClassService.update(+id, updateSchoolClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolClassService.remove(+id);
  }
}
