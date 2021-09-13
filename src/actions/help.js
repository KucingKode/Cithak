import chalk from 'chalk'

import * as errorHelper from '../helpers/error'
import * as infoHelper from '../helpers/info'
import * as stringHelper from '../helpers/string'

export async function help(options, state) {
  if (state === errorHelper.INVALID_ACTION) {
    errorHelper.send(state, { action: options.action })
    console.log(
      chalk.blue('INFO!'),
      `Try to run ${chalk.magenta('cth --help')} for help`
    )
    return
  }

  if (infoHelper[options.action]) {
    console.log(stringHelper.trim(infoHelper[options.action]))
    if (options.action !== 'flags')
      console.log(stringHelper.trim(infoHelper.flags))
  } else {
    console.log(stringHelper.trim(infoHelper.complete))
  }
}
