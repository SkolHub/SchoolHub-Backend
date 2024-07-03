import { Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class TestController {
	constructor(private readonly testService: TestService) {}

	@Post()
	@Public()
	generateDummyData() {
		return this.testService.generateDummyData();
	}
}
