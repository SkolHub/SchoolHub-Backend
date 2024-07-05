import { IsIn, IsInt, IsISO8601, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherPostDto {
	@IsString()
	@Length(1, 100)
	@ApiProperty()
	title: string;

	@IsString()
	@Length(1, 2000)
	@ApiProperty()
	body: string;

	@IsIn(['announcement', 'assignment', 'test', 'material'])
	type: 'announcement' | 'assignment' | 'test' | 'material';

	@IsInt()
	@ApiProperty()
	subjectID: number;

	@IsISO8601()
	@ApiProperty()
	dueDate: Date;
}
