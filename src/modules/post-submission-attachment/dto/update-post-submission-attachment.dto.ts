import { PartialType } from '@nestjs/swagger';
import { CreatePostSubmissionAttachmentDto } from './create-post-submission-attachment.dto';

export class UpdatePostSubmissionAttachmentDto extends PartialType(CreatePostSubmissionAttachmentDto) {}
