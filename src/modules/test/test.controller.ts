import { Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Development')
export class TestController {
	constructor(private readonly testService: TestService) {}

	@Post()
	@Public()
	@ApiOperation({
		description:
			'Generates an entire organization with 24 classes (years 9, 10 11 and 12 with letters A, B, C, D, E and F)' +
			'Each with at least 14 subjects, 30 students, teachers for each subject, grades and absences. ' +
			'Computer Science subjects have 2 teachers and German and French subjects are common between' +
			'school classes. 3 Admins are also created',
		summary: 'Generate dummy data'
	})
	generateDummyData() {
		return this.testService.generateDummyData();
	}
}
