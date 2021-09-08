const err = require('../constants/error')
const info = require('../constants/info')
const { trim } = require('../helpers/string')

exports.help = async (options, state) => {
  if (state === err.INVALID_ACTION) {
    err.send(state, { action: options.action })
    return
  }

  if (info[options.action]) {
    console.log(trim(info[options.action]))
  } else {
    console.log(trim(Object.values(info).join('\n')))
  }
}
