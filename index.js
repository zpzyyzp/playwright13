import playwright from 'playwright'
import fs from 'fs'
import getMeta from './libs/getMeta.js'

async function main(url, file) {
  const browser = await playwright.firefox.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('.mh-loop-item', { timeout: 30000})

  const content = await page.evaluate(() => {
    const articles = document.querySelectorAll('article .mh-loop-title a')
    return Array.from(articles).map((article) => { return {title: article.innerText, url: article.href} })
  })
  for (let i = 0; i < content.length; i++) {
    content[i] = { ...content[i], ...await getMeta(page, content[i].url) }
    fs.writeFileSync(file, JSON.stringify(content))
  }

  await browser.close()
}

main('http://13dl.net/page/44', 'json/content'+ '44' + '.json')
