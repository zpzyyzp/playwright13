import getRealURL from './getRealURL.js'

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

export default getMeta
