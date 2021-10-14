const resourceHacker = require('node-resourcehacker')
const path = require('path')

// Use the beta release of Resource Hacker.
process.env.SOURCE_RESOURCE_HACKER =
  'http://www.angusj.com/resourcehacker/resource_hacker.zip'

resourceHacker(
  {
    operation: 'addoverwrite',
    input: path.join(__dirname, '../build/bin/cithak-win.exe'),
    output: path.join(__dirname, '../build/bin/cithak-win.exe'),
    resource: path.join(__dirname, '../icon.ico'),
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
