import fs from 'fs-extra'
import glob from 'glob'
import chalk from 'chalk'
import { join } from 'path'

import { joinables } from './join'

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
        'node_modules',
        'node_modules/**/*',
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
        !options.silent && console.log(chalk.gray(`copied folder: ${file}`))
      }
    } else {
      // it's a file
      const joinable = fs.existsSync(destFile) && options.join
      let joiner

      if (joinable) {
        for (let i = 0; i < joinables.length; i += 1) {
          const [extension, func] = joinables[i]

          if (srcFile.toLowerCase().endsWith(extension)) {
            joiner = {
              extension,
              func,
            }
            break
          }
        }
      }

      if (joinable && joiner) {
        const result = joiner.func(
          fs.readFileSync(srcFile).toString(),
          fs.readFileSync(destFile).toString()
        )

        fs.writeFileSync(destFile, result)
        !options.silent &&
          console.log(chalk.gray(`joined ${joiner.extension}: ${file}`))
      } else {
        let action = 'copied'

        if (fs.existsSync(destFile)) {
          if (options.safe) {
            action = 'skipped'
          } else {
            action = 'replaced'
          }

          if (options.index) {
            const [newDestFile, i] = findIndex(destFile)
            destFile = newDestFile
            action = `copied as ${file} (${i})`
          }
        }

        fs.copySync(srcFile, destFile, { overwrite: !options.safe })

        !options.silent && console.log(chalk.gray(`${action}: ${file}`))
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

  files.forEach((file) => {
    const srcFile = join(src, file)

    if (fs.lstatSync(srcFile).isDirectory()) {
      fs.rmdirSync(srcFile)
      !options.silent && console.log(chalk.gray(`removed folder: ${file}`))
    } else {
      fs.rmSync(srcFile)
      !options.silent && console.log(chalk.gray(`removed: ${file}`))
    }
  })

  fs.rmdirSync(src)
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
