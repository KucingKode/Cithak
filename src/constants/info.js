import chalk from 'chalk'
import fs from 'fs-extra'
import * as paths from './paths'

const VERSION = fs.readJSONSync(paths.PACKAGE_JSON).version

export const stuck = `
   ${chalk.blue.bold('INFO!')} For more info please type ${chalk.yellow('cth --help')}
`
export const main = `
   Version ${VERSION}
   Usage:   ${chalk.yellow('[cth | cithak] [command] [flags]')}
   |        ${chalk.yellow('[cth | cithak] [-h | --help | -v | --version]')}
`
export const save = `
   ${chalk.blue.bold('Save a new template to your local machine:')}
   |  ${chalk.yellow('cth save [template-name]')}
`
export const clone = `
   ${chalk.blue.bold('Clone a template:')}
   |  ${chalk.yellow('cth clone ...[template-name]')}
`
export const update = `
   ${chalk.blue.bold('Update added template:')}
   | ${chalk.yellow('cth update [template-name] [path/to/template/directory]')}
`
export const backup = `
   ${chalk.blue.bold('Backup your local template storage:')}
   | ${chalk.yellow('cth backup')}
`
export const load = `
   ${chalk.blue.bold('Load a template backup:')}
   | ${chalk.yellow('cth load')}
`
export const remove = `
   ${chalk.blue.bold('Remove added template:')}
   |  ${chalk.yellow('cth remove [template-name]')}
`
export const merge = `
   ${chalk.blue.bold('Merge a template with another template:')}
   |  ${chalk.yellow('cth merge [template-name] ...[another-template-name]')}
`
export const info = `
   ${chalk.blue.bold('Get template information:')}
   |  ${chalk.yellow('cth info [template-name]')}
`
export const list = `
   ${chalk.blue.bold('Get list of added template:')}
   |  ${chalk.yellow('cth list')}
`

export const flags = `
   |
   |  flags:
   |     ${chalk.yellow('-h, --help')} : get command's information
   |     ${chalk.yellow('-v, --version')} : get cithak version
   |     ${chalk.yellow('-p, --path')} : add extra path relative to current working directory ${chalk.gray('( ex: -p ./my-folder )')}
   |     ${chalk.yellow('-y, --yes')} : exxecute all template tasks
   |     ${chalk.yellow('-s, --safe')} : copy template without replacing existing files
   |     ${chalk.yellow('-c, --change')} : change file that will be executed ${chalk.gray('( ex: \'npm|pnpm\' ) : npm i package -> pnpm i package')}
   |     ${chalk.yellow('--no-join')} : copy template without join joinable data file like json file
   |     ${chalk.yellow('--no-exec')} : copy template without execute any tasks
`

export const complete = 
   main + save + info + list + clone + update + remove + merge + flags