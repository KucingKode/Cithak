const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const VERSION = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))).version

exports.main = `
   Version ${VERSION}
   Usage:   ${chalk.yellow('[cth | cithak] [command] [flags]')}
   |        ${chalk.yellow('[cth | cithak] [-h | --help | -v | --version]')}
`
exports.add = `
   ${chalk.blue.bold('Add a new template:')}
   |  ${chalk.yellow('cth add [template-name] [path/to/template/directory]')}
   |
   |  flags:
   |     ${chalk.yellowBright('-l, --log')}: log every steps
`
exports.copy = `
   ${chalk.blue.bold('Copy a template:')}
   |  ${chalk.yellow('cd path/to/your-project')}
   |  ${chalk.yellow('cth copy [template-name] [path/to/target/directory]')}
   |
   |  flags:
   |     ${chalk.yellowBright('-l, --log')}: log every steps
   |     ${chalk.yellowBright('-f, --full')}: copy template's template.json file
   |     ${chalk.yellowBright('-y, --yes')}: give permission to template to use node and npm install
   |     ${chalk.yellowBright('-s, --safe')}: copy template but not replacing files
`
exports.update = `
   ${chalk.blue.bold('Update added template:')}
   | ${chalk.yellow('cth update [template-name] [path/to/template/directory]')}
   |
   |  flags:
   |     ${chalk.yellowBright('-l, --log')}: log every steps
`
exports.remove = `
   ${chalk.blue.bold('Remove added template:')}
   |  ${chalk.yellow('cth remove [template-name]')}
`
exports.info = `
   ${chalk.blue.bold('Get template information:')}
   |  ${chalk.yellow('cth info [template-name]')}
`
exports.list = `
   ${chalk.blue.bold('Get list of added template:')}
   |  ${chalk.yellow('cth list')}
`