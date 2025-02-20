/**
 * @note Custom imports
 * @example import * from 'src/utils'
 */

import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

import {SmaiScraper} from 'src/scrapers/smai-scraper'
import * as browser from 'src/utils/browser'
import {saveData} from 'src/utils/scraper'

// Export
export {fs, path}
export {SmaiScraper, browser, saveData, axios}
