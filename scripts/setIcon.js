const resourceHacker = require('node-resourcehacker')

// Use the beta release of Resource Hacker.
process.env.SOURCE_RESOURCE_HACKER =
  'http://www.angusj.com/resourcehacker/resource_hacker.zip'

resourceHacker(
  {
    operation: 'addoverwrite',
    input: '../build/bin/cithak-win.exe',
    output: '../build/bin/cithak-win.exe',
    resource: '../icon.ico',
    resourceType: 'ICONGROUP',
    resourceName: '1',
  },
  (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('Done')
  }
)
