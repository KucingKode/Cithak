const pkg = require('../../package.json')

module.exports = process({
  version: pkg.version,
  baseurl: '/Cithak/',
  features: [
    {
      icon: 'shield-lock-fill',
      title: 'Secure',
      description: `
        Cithak will log every activities and execute every tasks
        that you **give permission to execute**
      `,
    },
    {
      icon: 'file-earmark',
      title: 'Smart',
      description: `
        Cithak can **do more than overwrite your files**, it can join two
        .json, .yaml, .env and many more files or give index to new file
      `,
    },
    {
      icon: 'stopwatch',
      title: 'Simple',
      description: `
      Cithak was easy to use and easy to understand
      command and flags, it **takes no time to get started**
      `,
    },
    {
      icon: 'cloud-slash',
      title: 'Offline',
      description: `
        No need to worry to get offline, **Cithak can safe templates** from
        github, gitlab, or bitbucket to your storage for offline use
      `,
    },
    {
      icon: 'cloud',
      title: 'Anywhere',
      description: `
        Cithak also can **use template from anywhere**,
        clone templates from your local storage,
        github, gitlab, or bitbucket using git
      `,
    },
  ],
})

function process(obj) {
  obj.features.forEach((feature) => {
    feature.description = feature.description
      .replace(/\*\*(.+)\*\*/, '<strong>$1</strong>')
      .replace(/ {2,}/g, ' ')
  })

  return obj
}
