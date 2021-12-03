import chalk from 'chalk'

const tips = [
  "don't forget to update cithak",
  'use -i to prefer index and not overwrite',
  'from all md files, only README.md will be joined',
  'use -q or --quiet to hide activity log',
  'use --ne or --no-exec to ignore template tasks',
  '.yaml and .yml is same',
  'use -g or --git to initialize git',
  'template.json is powerful',
  'use cth backup to get all of your templates',
]

export function sendTips() {
  const i = Math.round(Math.random() * (tips.length - 1))
  console.log(chalk.blue('TIPS!'), tips[i])
}
