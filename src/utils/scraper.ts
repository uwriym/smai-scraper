import * as fs from 'fs/promises'
import { SmaiScraper } from 'src/utils/import'
import { ParseOptionsDto } from 'src/bot/dto/parse-options.dto'
import { convertToKebabCase } from 'src/utils/etc'

/**
 * Create scraper instance with given scraper name
 * @param scraperName
 * @example
 * import { createScraperInstance } from 'src/utils/scraper'
 * const scraper = await createScraperInstance('SmCalendarScraper')
 */
export async function createScraperInstance<T extends SmaiScraper>(
  scraperName: string,
) {
  // scraperName example: 'SmCalendarScraper'
  const scraperFileName = convertToKebabCase(scraperName)
  const scraperFilePath = `src/scrapers/${scraperFileName}.ts`

  const module = await import(scraperFilePath)
  const scraperClass = module[scraperName] as { new (): T }

  return new scraperClass()
}

/**
 * Start bot with given parse options
 * @param parseOptions
 * @example
 * import { startBot } from 'src/utils/scraper'
 * startBot({ scraperName: 'SmCalendarScraper' })
 */
export async function startBot(parseOptions: ParseOptionsDto) {
  const scraper = await createScraperInstance<SmaiScraper>(
    parseOptions.scraperName,
  )
  await scraper.parse(parseOptions)

  return true
}

// 디렉토리 생성 (Promise 반환)
async function createDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true }) // recursive 옵션 추가
    console.log(`${dirPath} 디렉토리를 생성했습니다.`)
  } catch (error) {
    console.error(`${dirPath} 디렉토리 생성 중 오류가 발생했습니다:`, error)
    throw error // 오류를 다시 던져서 상위 함수에서 처리하도록 함
  }
}

// 파일 생성 (Promise 반환)
async function createFile(filePath: string, data: any): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData)
    console.log(`${filePath} 파일을 생성했습니다.`)
  } catch (error) {
    console.error(`${filePath} 파일 생성 중 오류가 발생했습니다:`, error)
    throw error // 오류를 다시 던져서 상위 함수에서 처리하도록 함
  }
}

// 메인 함수 (async)
export async function saveData(data: any): Promise<boolean> {
  const scraperName = data['scraperName']
  const dirPath = `data/${scraperName}`
  const filePath = `${dirPath}/${getDataFileName()}.json`

  try {
    await createDirectory(dirPath) // await 사용
    await createFile(filePath, data) // await 사용
    console.log('Data saved:', data)
    return true
  } catch (error) {
    console.error('데이터 저장 중 오류가 발생했습니다:', error)
    return false
  }
}

function getDataFileName() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const formattedDateTime = `${year}${month}${day}-${hours}${minutes}${seconds}`
  return `my-file-${formattedDateTime}.json`
}
