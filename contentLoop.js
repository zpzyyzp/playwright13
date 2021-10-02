import playwright from 'playwright'
import fs from 'fs'
import getMeta from './libs/getMeta.js'

async function fetchAll(baseUrl, count , file) {
  const browser = await playwright.firefox.launch({ headless: false })
  const page = await browser.newPage()

  for(let k = count; k > 0; k--) {
    await page.goto(baseUrl + count)
    await page.waitForSelector('.mh-loop-item', { timeout: 30000})
    const content = await page.evaluate(() => {
      const articles = document.querySelectorAll('article .mh-loop-title a')
      return Array.from(articles).map((article) => { return {title: article.innerText, url: article.href} })
    })
    for (let i = 0; i < content.length; i++) {
      content[i] = { ...content[i], ...await getMeta(page, content[i].url) }
      fs.writeFileSync('json/' + file + k + '.json', JSON.stringify(content))
    }
  }

  await browser.close()
}

fetchAll('http://13dl.net/page/', 43, 'content')
