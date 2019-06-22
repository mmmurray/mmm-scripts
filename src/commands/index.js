const build = require('./build')
const commit = require('./commit')
const jest = require('./jest')
const lint = require('./lint')
const precommit = require('./precommit')

const commands = {
  build,
  commit,
  init: () => {
    console.log('Configuring project...')
  },
  jest: (projectRoot, options) =>
    jest(projectRoot, { watch: true, ...options }),
  precommit,
  'test:coverage': (projectRoot, options) =>
    jest(projectRoot, { coverage: true, ...options }),
  'test:lint': lint,
}

module.exports = commands
