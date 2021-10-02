import playwright from 'playwright'
import fs from 'fs'
import getMeta from './libs/getMeta'

async function main() {
  const browser = await playwright.firefox.launch({
    headless: false
  })
  const page = await browser.newPage()
  const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'))

  for (let i = 0; i < content.length; i++) {
    if (!content[i].date) {
      content[i] = { ...content[i], ...await getMeta(page, content[i].url) }
    }
    fs.writeFileSync('content.json', JSON.stringify(content))
  }

  await browser.close()
}

main()
