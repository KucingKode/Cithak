const { yellow } = require('chalk')

exports.NO_PERMISSION = `
   $task cancelled because permission not allowed
`

exports.format = (message) => `${yellow.bold('WARN!')} ${message}`

exports.send = (warn, params) => {
  let message = warn

  Object.keys(params).forEach((key) => {
    message = message.replace(`$${key}`, params[key] || '')
  })

  console.log(this.format(message))
  return false
}
