import { IsString } from 'class-validator'

export class ParseOptionsDto {
  @IsString()
  readonly scraperName!: string
}
