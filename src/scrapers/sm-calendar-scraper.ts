import { ParseOptionsDto } from 'src/bot/dto/parse-options.dto'
import { axios, browser, saveData, SmaiScraper } from 'src/utils/import'
import { SmCalendarDto } from 'src/bot/dto/sm-calendar.dto'

/**
 * @example
 * import { startBot } from 'src/utils/scraper'
 * startBot({ scraperName: 'SmCalendarScraper' })
 */

export class SmCalendarScraper implements SmaiScraper {
  version = 0.01

  async parse(parseOptions: ParseOptionsDto): Promise<void> {
    console.log('Parsing test scraper with options:', parseOptions)

    const page = await browser.page()
    await page.goto('https://www.smu.ac.kr/kor/index.do')

    const logoImgXpath = "//img[@alt='상명대학교']"
    const logoImg = await browser.waitForXpath({
      page: page,
      xpath: logoImgXpath,
      timeout: 10000,
    })
    if (!logoImg) throw new Error('Logo image not found')

    // 'kor_visited=20250219181308627001 locale=ko JSESSIONID=xmTkxjN8KAYapr22JVsIDEuAqJgjor0Xc5SllATrvXtTnyIwvtEG2GEfabXwwAWf.d3d3X2RvbWFpbi9jbXM= _gid=GA1.3.44520378.1739956394 develop_preview_mode=N _gat_gtag_UA_129351146_1=1 _ga=GA1.1.2042048645.1739956394 _ga_5BEDF8DSQJ=GS1.1.1739956393.1.1.1739956589.0.0.0'
    const cookieString = await browser.getCookies(page)

    // 학사일정 API 요청
    const res = await this.fetchSmCalendar(cookieString)
    const calendarDataList = res.data['list']
    if (!calendarDataList) throw new Error('학사일정 데이터 없음')

    console.log(`학사일정 데이터 ${calendarDataList.length}건 확인`)

    const dataList: SmCalendarDto[] = []

    for (const calendarData of calendarDataList) {
      const dataObject: SmCalendarDto = {
        scraperName: this.constructor.name,
        title: calendarData['articleTitle'],
        startDate: calendarData['etcChar6'],
        endDate: calendarData['etcChar7'],
      }

      console.log(dataObject)
      dataList.push(dataObject)
    }

    await saveData(dataList)
  }

  async fetchSmCalendar(cookieString: string) {
    const requestUrl = 'https://www.smu.ac.kr/app/common/selectDataList.do'
    const headers = {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      cookie: cookieString,
      host: 'www.smu.ac.kr',
      origin: 'https://www.smu.ac.kr',
      referer: 'https://www.smu.ac.kr/kor/index.do',
    }
    const body = {
      sqlId: 'jw.Article.selectCalendarArticle',
      modelNm: 'list',
      jsonStr:
        '{"year":"2025","bachelorBoardNoList":["85","983"],"yList":["2024","2025","2026"]}',
    }

    try {
      return await axios({
        method: 'POST',
        url: requestUrl,
        headers: headers,
        data: body,
      })
    } catch (error) {
      throw new Error(`학사일정 API 요청 오류: ${error}`)
    }
  }
}
