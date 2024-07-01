import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaggedDto {
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	tags: string[];
}
