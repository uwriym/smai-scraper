import {Injectable} from '@nestjs/common'
import {ParseOptionsDto} from './dto/parse-options.dto'
import {startBot} from "../utils/scraper";

@Injectable()
export class BotService {
    getAllBots() {
        return 'all bots'
    }

    async scrape(botId: number, parseOptions: ParseOptionsDto) {
        console.log(`Starting bot ${botId} with options:`, parseOptions)

        await startBot(parseOptions)
        return 'bot started'
    }
}
