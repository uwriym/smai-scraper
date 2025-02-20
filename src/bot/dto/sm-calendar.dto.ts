import {IsString} from 'class-validator'

export class SmCalendarDto {
    @IsString()
    readonly title!: string

    @IsString()
    readonly startDate!: string

    @IsString()
    readonly endDate!: string
}
