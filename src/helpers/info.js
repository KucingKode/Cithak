import chalk from 'chalk'
import {version as VERSION} from '../../package.json'

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
   |  ${chalk.yellow('cth [save|sv] [template-name]')}
`
export const clone = `
   ${chalk.blue.bold('Clone a template:')}
   |  ${chalk.yellow('cth [clone|cl] ...[template-name or git-repo]')}
`
export const update = `
   ${chalk.blue.bold('Update added template:')}
   | ${chalk.yellow('cth update [template-name]')}
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
   |  ${chalk.yellow('cth [remove|rm] [template-name]')}
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

export const rename = `
   ${chalk.blue.bold('Rename saved template:')}
   |  ${chalk.yellow('cth rename [template-name] [new-tmplate-name]')}
`

export const flags = `
   |
   |  flags:
   |     ${chalk.yellow('-h, --help')} : get command information
   |     ${chalk.yellow('-v, --version')} : get cithak version
   |     ${chalk.yellow('-p, --path')} : add extra path relative to current working directory or a git repo
   |     ${chalk.gray('( ex: -p ./my-folder or -p github@username/repo )')}

   |     ${chalk.yellow('-y, --yes')} : execute all template tasks
   |     ${chalk.yellow('-s, --safe')} : copy template without replacing existing files
   |     ${chalk.yellow('-c, --change')} : change file that will be executed
   |     ${chalk.gray('( ex: \'npm|pnpm\' ) : npm i package -> pnpm i package')}
   
   |     ${chalk.yellow('-i, --index')} : prefer index and not overwrite files
   |     ${chalk.yellow('--nm, --no-merge')} : copy template without merge mergeables files like json file
   |     ${chalk.yellow('--ne, --no-exec')} : copy template without execute any tasks
   |     ${chalk.yellow('-q, --quiet')} : hide activity detail logs
`

export const complete =
  main + save + info + list + clone + update + remove + merge + rename + flags
