## Run Scraper API

### Start API Server

```bash
npm run start:dev
```

### Start Scraper

```bash
curl -X POST \
  --header "Content-Type: application/json" \
  --data '{
    "scraperName": "SmCalendarScraper"
  }' \
  'localhost:3000/bots/1/scrape'
```

---

## Run Scraper in Console

### Start Console

```bash
npm run console
```

### Start Scraper

```bash
import { startBot } from 'src/utils/scraper'
startBot({ scraperName: 'SmCalendarScraper' })
```
