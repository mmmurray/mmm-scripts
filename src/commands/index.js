const build = require('./build')
const jest = require('./jest')
const lint = require('./lint')

const commands = {
  build,
  jest: (projectRoot, options) =>
    jest(projectRoot, { watch: true, ...options }),
  'test:coverage': (projectRoot, options) =>
    jest(projectRoot, { coverage: true, ...options }),
  'test:lint': lint,
}

module.exports = commands
