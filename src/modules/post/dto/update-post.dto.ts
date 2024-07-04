import { IsIn, IsString, Length } from 'class-validator';

export class UpdatePostDto {
	@IsString()
	@Length(1, 100)
	title: string;

	@IsString()
	@Length(1, 2000)
	body: string;

	@IsIn(['announcement', 'assignment', 'test', 'material'])
	type: 'announcement' | 'assignment' | 'test' | 'material';
}
