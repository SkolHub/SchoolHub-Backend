import { PartialType } from '@nestjs/swagger';
import { CreatePostAttachmentDto } from './create-post-attachment.dto';

export class UpdatePostAttachmentDto extends PartialType(CreatePostAttachmentDto) {}
