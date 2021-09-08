const { magenta, blue, gray } = require('chalk')
const fs = require('fs-extra')
const paths = require('./paths')

const VERSION = fs.readJSONSync(paths.PACKAGE_JSON).version

exports.stuck = `
   ${blue.bold('INFO!')} For more info please type ${magenta('cth --help')}
`
exports.main = `
   Version ${VERSION}
   Usage:   ${magenta('[cth | cithak] [command] [flags]')}
   |        ${magenta('[cth | cithak] [-h | --help | -v | --version]')}
`
exports.add = `
   ${blue.bold('Add a new template:')}
   |  ${magenta('cth add [template-name] [path/to/template/directory]')}
`
exports.copy = `
   ${blue.bold('Copy a template:')}
   |  ${magenta('cd path/to/your-project')}
   |  ${magenta('cth copy [template-name] [path/to/target/directory]')}
   |
   |  flags:
   |     ${magenta('-y, --yes')}: exxecute all template tasks
   |     ${magenta('-s, --safe')}: copy template without replacing existing files
   |     ${magenta('-c, --change')}: change file that will be executed ${gray('( ex: \'npm|pnpm\' ) : npm i package -> pnpm i package')}
   |     ${magenta('--no-join')}: copy template without join joinable data file like json file
   |     ${magenta('--no-exec')}: copy template without execute any tasks
`
exports.update = `
   ${blue.bold('Update added template:')}
   | ${magenta('cth update [template-name] [path/to/template/directory]')}
`
exports.remove = `
   ${blue.bold('Remove added template:')}
   |  ${magenta('cth remove [template-name]')}
`
exports.info = `
   ${blue.bold('Get template information:')}
   |  ${magenta('cth info [template-name]')}
`
exports.list = `
   ${blue.bold('Get list of added template:')}
   |  ${magenta('cth list')}
`