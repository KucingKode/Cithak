const fs = require('fs')
const ghpages = require('gh-pages')

const htmlPath = __dirname + '/../docs/_site/index.html'
const html = fs
  .readFileSync(htmlPath)
  .toString()
  .replace(
    /<.*="(.*\.js).*>/g,
    '<script defer type="module" src="$1"></script>'
  )
  .replace(/((?:src)|(?:href))="\//g, '$1="')
  .replace('<base>', '<base href="/Cithak/" />')

fs.writeFileSync(htmlPath, html)

ghpages.publish(
  'docs/_site',
  {
    branch: 'gh-pages',
    repo: 'https://github.com/KucingKode/Cithak.git',
    history: false,
  },
  () => {
    console.log('Deploy Complete!')
  }
)
