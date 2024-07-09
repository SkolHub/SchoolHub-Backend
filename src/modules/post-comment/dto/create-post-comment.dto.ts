import { IsInt, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentDto {
	@IsString()
	@Length(1, 1000)
	@ApiProperty()
	body: string;

	@IsInt()
	@ApiProperty()
	postID: number;
}
