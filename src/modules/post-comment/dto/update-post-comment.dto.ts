import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostCommentDto {
	@IsString()
	@Length(1, 1000)
	@ApiProperty()
	body: string;
}
