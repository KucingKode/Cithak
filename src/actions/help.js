import chalk from 'chalk'

import * as errors from '../constants/errors'
import * as info from '../constants/info'
import * as string from '../helpers/string'

export async function help(options, state) {
  if (state === errors.INVALID_ACTION) {
    errors.send(state, { action: options.action })
    console.log(
      chalk.blue('INFO!'),
      `Try to run ${chalk.magenta('cth --help')} for help`
    )
    return
  }

  if (info[options.action]) {
    console.log(string.trim(info[options.action]))
    if (options.action !== 'flags') console.log(string.trim(info.flags))
  } else {
    console.log(string.trim(info.complete))
  }
}
