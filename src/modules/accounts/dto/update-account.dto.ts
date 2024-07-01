import { IsString, Length } from 'class-validator';

export class UpdateAccountDto {
    @IsString()
    @Length(3, 100)
    displayName: string;
}
