const build = require('./build')
const lint = require('./lint')

const commands = {
  build,
  'test:lint': lint,
}

module.exports = commands
