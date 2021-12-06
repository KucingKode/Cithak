import fs from 'fs-extra'
import glob from 'glob'
import chalk from 'chalk'
import { join } from 'path'

import { mergeables } from './merge'

// data getter
export function getTemplateData(templatePath) {
  const path = join(templatePath, 'template.json')

  if (!fs.existsSync(path)) return {}
  return fs.readJSONSync(path)
}

// folder operations
export function copyFolder(src, dest, options = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }

  const files = {}
  const patterns = ['**/*', ...(options.include || [])]

  patterns.forEach((pattern) => {
    const matches = glob.sync(pattern, {
      cwd: src,
      dot: true,
      ignore: [
        '**/node_modules',
        '**/node_modules/**/*',
        '**/.git',
        '**/.git/**/*',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        ...(options.exclude || []),
      ],
    })

    matches.forEach((match) => {
      files[match] = true
    })
  })

  Object.keys(files).forEach((file) => {
    const srcFile = join(src, file)
    let destFile = join(dest, file.replace(/(?:\.{2}\/?)*/, ''))

    if (fs.lstatSync(srcFile).isDirectory()) {
      // it's a directory
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true })
        !options.quiet && console.log(chalk.gray(`cloned folder: ${file}`))
      }
    } else {
      // it's a file
      const mergeable = fs.existsSync(destFile) && options.merge
      let merger

      if (mergeable) {
        for (let i = 0; i < mergeables.length; i += 1) {
          const [extension, func] = mergeables[i]

          if (srcFile.toLowerCase().endsWith(extension)) {
            merger = {
              extension,
              func,
            }
            break
          }
        }
      }

      if (mergeable && merger) {
        const result = merger.func(
          fs.readFileSync(srcFile).toString(),
          fs.readFileSync(destFile).toString()
        )

        fs.writeFileSync(destFile, result)
        !options.quiet &&
          console.log(chalk.gray(`merged ${merger.extension}: ${file}`))
      } else {
        let action = 'cloned'

        if (fs.existsSync(destFile)) {
          if (options.safe) {
            action = 'skipped'
          } else {
            action = 'replaced'
          }

          if (options.index) {
            const [newDestFile, i] = findIndex(destFile)
            destFile = newDestFile
            action = `cloned as ${file} (${i})`
          }
        }

        fs.copySync(srcFile, destFile, { overwrite: !options.safe })

        !options.quiet && console.log(chalk.gray(`${action}: ${file}`))
      }
    }
  })
}

export function removeFolder(src, options = {}) {
  const files = glob
    .sync('**/*', {
      dot: true,
      cwd: src,
    })
    .reverse()

  try {
    files.forEach((file) => {
      const srcFile = join(src, file)

      if (fs.lstatSync(srcFile).isDirectory()) {
        fs.rmdirSync(srcFile)
        !options.quiet && console.log(chalk.gray(`removed folder: ${file}`))
      } else {
        fs.rmSync(srcFile)
        !options.quiet && console.log(chalk.gray(`removed: ${file}`))
      }
    })
  } catch (err) {
    console.log(`${chalk.red(`error: ${err.message}`)}`)

    try {
      console.log(`${chalk.gray(`deleting ${src}`)}`)
      fs.rmdirSync(src)
      console.log(`${chalk.gray(`deleted ${src}`)}`)
    } catch (_err) {
      console.log(
        `${chalk.red(`\ndelete failed, please delete ${src} manually`)}`
      )
    }
  }
}

function findIndex(fileName) {
  // return fileName -> fileName (1)
  // used if options.index used

  let i = 1
  while (fs.existsSync(`${fileName} (${i})`)) {
    i += 1
  }

  return [`${fileName} (${i})`, i]
}
