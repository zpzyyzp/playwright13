const fs = require('fs')

const title = JSON.parse(fs.readFileSync('./title.json', 'utf8'))
const content = JSON.parse(fs.readFileSync('./content.json', 'utf8'))

const result = title.slice()

const merge = result.map((x, index) => {
  return {
    ...x,
    ...content[index]
  }
})

fs.writeFileSync('merge.json', JSON.stringify(merge))
