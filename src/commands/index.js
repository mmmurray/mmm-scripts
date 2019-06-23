const build = require('./build')
const commit = require('./commit')
const jest = require('./jest')
const lint = require('./lint')
const precommit = require('./precommit')
const release = require('./release')

const commands = {
  build,
  commit,
  init: () => {
    console.log('Configuring project...')
  },
  jest: (config, options) => jest(config, { watch: true, ...options }),
  precommit,
  release,
  test: async config => {
    await lint(config)
    await jest(config, { coverage: true })
  },
  'test:coverage': (config, options) =>
    jest(config, { coverage: true, ...options }),
  'test:lint': lint,
}

module.exports = commands
