const arg = require('arg')
const fs = require('fs-extra')

const pathTo = require('./constants/paths')
const err = require('./constants/error')

// actions
const helpAction = require('./actions/help').help
const listAction = require('./actions/list').list
const infoAction = require('./actions/info').info

const addAction = require('./actions/add').add
const copyAction = require('./actions/copy').copy
const removeAction = require('./actions/remove').remove
const updateAction = require('./actions/update').update

const actions = {
  // helper action
  help: helpAction,
  list: listAction,
  info: infoAction,

  // main action
  add: addAction,
  copy: copyAction,
  remove: removeAction,
  update: updateAction,
}

function parseArgs(rawArgs) {
  try {
    const args = arg(
      {
        '--yes': Boolean,
        '--safe': Boolean,
        '--help': Boolean,
        '--change': String,
        '--no-join': Boolean,
        '--no-exec': Boolean,
        '-y': '--yes',
        '-s': '--safe',
        '-h': '--help',
        '-c': '--change',
      },
      {
        argv: rawArgs.slice(2),
      }
    )

    return {
      action: !args._[0] ? 'help' : args._[0],
      templateName: args._[1],
      targetPath: args._[2] || '.',

      needHelp: args['--help'],
      allowsAll: args['--yes'],
      safe: args['--safe'],
      noJoin: args['--no-join'],
      noExec: args['--no-exec'],

      changes: parseChanges(args['--change']),
    }
  } catch ({ message }) {
    console.log(err.format(message))
    return { err: true }
  }
}

function parseChanges(str) {
  return str && str.split
    ? str.split(' ').map((change) => change.split('|'))
    : []
}

exports.cli = (args) => {
  if (!fs.existsSync(pathTo.STORAGE)) {
    // setup
    fs.mkdirSync(pathTo.STORAGE)
    fs.writeFileSync(pathTo.DATA_JSON, '{}')
  }

  const options = parseArgs(args)
  if (options.err) return

  if (options.action === 'help' || options.needHelp) {
    actions.help(options)
  }

  if (actions[options.action]) {
    actions[options.action](options)
  } else {
    actions.help(options, err.INVALID_ACTION)
  }
}
