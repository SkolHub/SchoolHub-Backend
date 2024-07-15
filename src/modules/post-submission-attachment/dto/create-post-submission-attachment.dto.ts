import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostSubmissionAttachmentDto {
	@IsString()
	@Length(1, 300)
	@ApiProperty()
	link: string;
}
