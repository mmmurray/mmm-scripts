const { join } = require('path')

const getBinPath = executable =>
  join(__dirname, '..', '..', 'node_modules', '.bin', executable)

module.exports = getBinPath
