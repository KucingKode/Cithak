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
    const destFile = join(dest, file.replace(/(?:\.{2}\/?)*/, ''))

    if (fs.lstatSync(srcFile).isDirectory()) {
      // it's a directory
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true })
        console.log(chalk.gray(`copied folder: ${file}`))
      }
    } else {
      // it's a file
      const joinable = fs.existsSync(destFile) && options.join
      let joiner

      if (joinable) {
        for (let i = 0; i < joinables.length; i += 1) {
          const { extension } = joinables[i]

          if (srcFile.endsWith(extension)) {
            joiner = joinables[i]
            break
          }
        }
      }

      if (joinable && joiner) {
        const result = joiner.joiner(
          fs.readFileSync(srcFile).toString(),
          fs.readFileSync(destFile).toString()
        )

        fs.writeFileSync(destFile, result)
        console.log(chalk.gray(`joined ${joiner.extension}: ${file}`))
      } else {
        let action = 'copied'

        if (fs.existsSync(destFile)) {
          if (options.safe) {
            action = 'skipped'
          } else {
            action = 'replaced'
          }
        }

        fs.copySync(srcFile, destFile, { overwrite: !options.safe })

        console.log(chalk.gray(`${action}: ${file}`))
      }
    }
  })
}

export function removeFolder(src) {
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
      console.log(chalk.gray(`removed folder: ${file}`))
    } else {
      fs.rmSync(srcFile)
      console.log(chalk.gray(`removed: ${file}`))
    }
  })

  fs.rmdirSync(src)
}
