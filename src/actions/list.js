const fs = require('fs-extra')
const chalk = require('chalk')

const pathTo = require('../constants/paths')
const { getTemplateData } = require('../helpers/file')

exports.list = async () => {
  const storageData = fs.readJSONSync(pathTo.DATA_JSON)

  let list = ''
  Object.keys(storageData).forEach((key) => {
    const desc = getTemplateData(storageData[key]).description || '...'
    list += `- ${chalk.magenta(key)}\n${desc}\n\n`
  })

  console.log(list.replace(/\n\n$/, ''))
}
