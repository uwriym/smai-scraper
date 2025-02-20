import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common'
import { BotService } from './bot.service'
import { ParseOptionsDto } from './dto/parse-options.dto'

@Controller('bots')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
  @Version('1')
  getAllBots() {
    return this.botService.getAllBots()
  }

  @Post('/:id/scrape')
  @Version('1')
  scrape(@Param('id') botId: number, @Body() parseOptions: ParseOptionsDto) {
    return this.botService.scrape(botId, parseOptions)
  }
}
