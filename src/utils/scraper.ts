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

async function createDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true }) // recursive 옵션 추가
  } catch (error) {
    console.error(`[createDir] Error: ${error}`)
    throw error
  }
}

async function createFile(filePath: string, data: any): Promise<string> {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData)
    return filePath
  } catch (error) {
    console.error(`[createFile] Error: ${error}`)
    throw error
  }
}

export async function saveData({
  data,
  format = 'json',
  saveDir,
}: {
  data: any
  format?: string
  saveDir: string
}): Promise<boolean> {
  const dirPath = `data/${saveDir}`
  const filePath = `${dirPath}/${getDataFileName()}.json`

  try {
    await createDir(dirPath)
    const createdFilePath = await createFile(filePath, data)
    console.log(`[saveData] ${format} data saved: ${createdFilePath}`)
    return true
  } catch (error) {
    console.error('[saveData] Error:', error)
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
  return `${formattedDateTime}`
}
