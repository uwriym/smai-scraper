/**
 * @example import * as browser from "src/utils/browser"
 */

import {Browser, chromium, ElementHandle, Page} from 'playwright'

let browser: Browser
const currentPage: Page | null = null

/**
 * Get the current Page object
 * @returns {Promise<Page>}
 * @example
 * const page = await browser.page()
 */
export const page = async (): Promise<Page> => {
    if (currentPage) return currentPage

    console.log('Opening new page')

    browser = await chromium.launch({headless: false})
    const context = await browser.newContext()
    return await context.newPage()
}

/**
 * Close the browser
 * @returns {Promise<void>}
 * @example
 * await browser.closeBrowser()
 */
export const closeBrowser = async (): Promise<void> => {
    await browser?.close()
}

/**
 * Get cookies string from the browser
 * @param {Page} currentPage
 * @returns {string}
 * @example
 * const cookieString = await browser.getCookies(page)
 */
export const getCookies = async (currentPage: Page): Promise<string> => {
    if (!currentPage) throw new Error('No page object found')

    console.log(`currentPage: ${currentPage}`)

    const cookies = await currentPage.context().cookies()
    return cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join(' ')
}


/**
 * Wait for the given XPath to appear on the page
 * @param page
 * @param xpath
 * @param timeout in milliseconds
 * @returns {Promise<ElementHandle<SVGElement | HTMLElement>[]}
 * @example
 * const elements = await browser.waitForXpath(page, "//div[@class='test']", timeout: 5000)
 */
export const waitForXpath = async ({
                                       page,
                                       xpath,
                                       timeout = 5000
                                   }: {
    page: Page
    xpath: string
    timeout?: number
}): Promise<ElementHandle<SVGElement | HTMLElement>[]> => {
    try {
        await page.waitForSelector(xpath, {timeout: timeout})
        console.log(`XPath ${xpath} found`)
        return await page.$$(xpath)
    } catch (error) {
        console.error(`XPath ${xpath} not found in ${timeout}ms`)
        return []
    }
}