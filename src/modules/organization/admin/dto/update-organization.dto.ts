import {IsString, Length} from "class-validator";

export class UpdateOrganizationDto {
    @IsString()
    @Length(3, 100)
    name: string;
}
