const playwright = require('playwright')
const fs = require('fs')

async function main(baseUrl, count , file) {
  const browser = await playwright.firefox.launch({
    headless: false
  })

  const page = await browser.newPage()

  for(let k = count; k > 0; k--) {
    await page.goto(baseUrl + count)
    await page.waitForSelector('.mh-loop-item', { timeout: 30000})
    const content = await page.evaluate(() => {
      const articles = document.querySelectorAll('article .mh-loop-title a')
      return Array.from(articles).map((article) => { return {url: article.href, title: article.innerText} })
    })
    for (let i = 19; i < content.length; i++) {
      content[i] = { ...content[i], ...await getMeta(page, content[i].url) }
      fs.writeFileSync('json/' + file + count + '.json', JSON.stringify(content))
    }
  }

  await browser.close()
}

async function getMeta(page, url) {
  await page.goto(url)
  await page.waitForTimeout(Math.random()*10000)
  await page.waitForSelector('.entry-content', { timeout: 30000 })
  const metadata = await page.evaluate(() => {
    const date = document.querySelector('header .mh-meta-date').textContent
    const category = document.querySelector('header .mh-meta-categories').textContent.split(', ')
    const tag = document.querySelector('header .mh-meta-Tag').textContent.split(', ')
    const description = document.querySelector('.MIntroduction') ? document.querySelector('.MIntroduction').textContent.replace('作品内容:', '') : ''
    const tds = Array.from(document.querySelectorAll('td'))
      .filter(x => x.innerText === 'RapidGator(Premium)')
      .map((td) => {
        const file = td.parentElement.querySelector('a')
        const rgFilenameSize = file.title.includes(' (') ? file.title : file.text
        const OriginalURL = file.href
        return {
          Filename: rgFilenameSize.split(' (')[0],
          Filesize: rgFilenameSize.split(' (')[1] ? rgFilenameSize.split(' (')[1].replace(')', '') : '',
          OriginalURL,
          DownloadedFlag: 0
        }
      })
    return {
      date, category, tag, description, tds
    }
  })
  for (let j = 0; j < metadata.tds.length; j++) {
    console.log('Get Url for' + metadata.tds[j].Filename)
    metadata.tds[j].RealURL = await getRealURL(page, metadata.tds[j].OriginalURL).catch(() => { return null })
  }
  console.log(metadata)
  return metadata
}

async function getRealURL(page, url) {
  await page.goto(url)
  await page.waitForTimeout(Math.random()*10000)
  await page.waitForSelector('.slogan', { timeout: 30000 })
  return page.url()
}

main('http://13dl.net/page/', 44, 'content')
