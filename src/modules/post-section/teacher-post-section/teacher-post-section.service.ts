import { Injectable } from '@nestjs/common';
import { CreatePostSectionDto } from './dto/create-post-section.dto';
import { UpdatePostSectionDto } from './dto/update-post-section.dto';
import { DBService } from '../../../common/db.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class TeacherPostSectionService extends DBService {
	async create(createPostSectionDto: CreatePostSectionDto) {
		await this.db.execute(sql`
            INSERT INTO "PostSection" (name, "subjectID")
            SELECT ${createPostSectionDto.name}, ${createPostSectionDto.subjectID}
            WHERE EXISTS (SELECT 1
                          FROM "TeacherToSubject"
                          WHERE "subjectID" = ${createPostSectionDto.subjectID}
                            AND "teacherID" = ${this.userID})
        `);
	}

	async update(sectionID: number, updatePostSectionDto: UpdatePostSectionDto) {
		await this.db.execute(sql`
            UPDATE "PostSection" ps
            SET name = ${updatePostSectionDto.name}
            FROM "TeacherToSubject" tts
            WHERE ps.id = ${sectionID}
              AND tts."teacherID" = ${this.userID}
              AND tts."subjectID" = ps."subjectID"
        `);
	}

	async remove(sectionID: number) {
		await this.db.execute(sql`
            DELETE
            FROM "PostSection" ps
                USING "TeacherToSubject" tts
            WHERE ps.id = ${sectionID}
              AND tts."teacherID" = ${this.userID}
              AND tts."subjectID" = ps."subjectID"
        `);
	}
}
