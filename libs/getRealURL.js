async function getRealURL(page, url) {
  await page.goto(url)
  await page.waitForTimeout(Math.random()*10000)
  await page.waitForSelector('.slogan', { timeout: 30000 })
  return page.url()
}

export default getRealURL
