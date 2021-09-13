import arg from 'arg'
import fs from 'fs-extra'

import * as pathHelper from './helpers/path'
import * as errorHelper from './helpers/error'

// actions
import { help as helpAction } from './actions/help'
import { list as listAction } from './actions/list'
import { info as infoAction } from './actions/info'

import { save as saveAction } from './actions/save'
import { clone as cloneAction } from './actions/clone'
import { remove as removeAction } from './actions/remove'
import { update as updateAction } from './actions/update'
import { merge as mergeAction } from './actions/merge'
import { rename as renameAction } from './actions/rename'

import * as backupAction from './actions/backup'

const actions = {
  // helper action
  help: helpAction,
  list: listAction,
  info: infoAction,

  // main action
  save: saveAction,
  clone: cloneAction,
  remove: removeAction,
  update: updateAction,
  merge: mergeAction,
  rename: renameAction,

  // backup action
  backup: backupAction.backup,
  load: backupAction.load,
}

function parseArgs(rawArgs) {
  try {
    const args = arg(
      {
        '--yes': Boolean,
        '--safe': Boolean,
        '--help': Boolean,
        '--version': Boolean,
        '--change': String,
        '--no-join': Boolean,
        '--no-exec': Boolean,
        '--path': String,
        '-y': '--yes',
        '-s': '--safe',
        '-h': '--help',
        '-v': '--version',
        '-c': '--change',
        '-p': '--path',
      },
      {
        argv: rawArgs.slice(2),
      }
    )

    return {
      action: !args._[0] ? 'help' : args._[0],
      targetPath: args['--path'] || '.',
      templateNames: args._.slice(1, args._.length),

      needVersion: args['--version'],
      needHelp: args['--help'],
      allowsAll: args['--yes'],
      safe: args['--safe'],
      noJoin: args['--no-join'],
      noExec: args['--no-exec'],

      changes: parseChanges(args['--change']),
    }
  } catch ({ message }) {
    console.log(errorHelper.format(message))
    return { err: true }
  }
}

function parseChanges(str) {
  return str && str.split
    ? str.split(' ').map((change) => change.split('|'))
    : []
}

exports.cli = (args) => {
  if (!fs.existsSync(pathHelper.STORAGE)) {
    // setup
    fs.mkdirSync(pathHelper.STORAGE, { recursive: true })
    fs.writeFileSync(pathHelper.DATA_JSON, '{}')
  }

  pathHelper.state.cwd = process.cwd()

  const options = parseArgs(args)
  if (options.err) return

  if (options.needVersion) {
    console.log(`v${fs.readJSONSync(pathHelper.PACKAGE_JSON).version}`)
  } else if (options.action === 'help' || options.needHelp) {
    actions.help(options)
  } else if (actions[options.action]) {
    actions[options.action](options)
  } else {
    actions.help(options, errorHelper.INVALID_ACTION)
  }
}
