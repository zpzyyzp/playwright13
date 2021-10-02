import playwright from 'playwright'
import fs from 'fs'
import getMeta from './libs/getMeta'

async function main(url, file) {
  const browser = await playwright.firefox.launch({
    headless: false
  })

  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('.mh-loop-item', { timeout: 30000})
  const content = await page.evaluate(() => {
    const articles = document.querySelectorAll('article .mh-loop-title a')
    return Array.from(articles).map((article) => { return {url: article.href, title: article.innerText} })
  })
  for (let i = 0; i < content.length; i++) {
    content[i] = { ...content[i], ...await getMeta(page, content[i].url) }
    fs.writeFileSync(file, JSON.stringify(content))
  }

  await browser.close()
}

main('http://13dl.net/page/45', 'content'+ '45' + '.json')
