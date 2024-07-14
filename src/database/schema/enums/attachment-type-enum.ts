import { pgEnum } from 'drizzle-orm/pg-core';

export const attachmentTypeEnum = pgEnum('AttachmentType', ['link', 'file']);
