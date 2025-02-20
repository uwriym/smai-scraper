import {ParseOptionsDto} from 'src/bot/dto/parse-options.dto'

export interface SmaiScraper {
    version: number

    parse(parseOptions: ParseOptionsDto): Promise<void>
}
