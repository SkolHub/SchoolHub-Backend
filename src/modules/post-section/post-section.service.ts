import { Injectable } from '@nestjs/common';
import { CreatePostSectionDto } from './dto/create-post-section.dto';
import { UpdatePostSectionDto } from './dto/update-post-section.dto';
import { DBService } from '../../common/db.service';
import { and, eq, sql } from 'drizzle-orm';
import { postSections } from '../../database/schema/post-sections';
import { teachersToSubjects } from '../../database/schema/teachers-to-subjects';

@Injectable()
export class PostSectionService extends DBService {
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

	findOne(subjectID: number) {
		return this.db
			.select({
				id: postSections.id,
				name: postSections.name
			})
			.from(postSections)
			.innerJoin(
				teachersToSubjects,
				and(
					eq(teachersToSubjects.subjectID, subjectID),
					eq(teachersToSubjects.teacherID, this.userID)
				)
			)
			.where(eq(postSections.subjectID, subjectID));
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
        `)
	}
}
