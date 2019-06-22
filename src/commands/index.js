const build = require('./build')
const commit = require('./commit')
const jest = require('./jest')
const lint = require('./lint')

const commands = {
  build,
  commit,
  jest: (projectRoot, options) =>
    jest(projectRoot, { watch: true, ...options }),
  'test:coverage': (projectRoot, options) =>
    jest(projectRoot, { coverage: true, ...options }),
  'test:lint': lint,
}

module.exports = commands
