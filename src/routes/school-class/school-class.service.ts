import { Injectable } from '@nestjs/common';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { UpdateSchoolClassDto } from './dto/update-school-class.dto';

@Injectable()
export class SchoolClassService {
  create(createSchoolClassDto: CreateSchoolClassDto) {
    return 'This action adds a new schoolClass';
  }

  findAll() {
    return `This action returns all schoolClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schoolClass`;
  }

  update(id: number, updateSchoolClassDto: UpdateSchoolClassDto) {
    return `This action updates a #${id} schoolClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} schoolClass`;
  }
}
