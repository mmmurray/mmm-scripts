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
  jest: (projectRoot, options) =>
    jest(projectRoot, { watch: true, ...options }),
  precommit,
  release,
  test: async projectRoot => {
    await lint(projectRoot)
    await jest(projectRoot, { coverage: true })
  },
  'test:coverage': (projectRoot, options) =>
    jest(projectRoot, { coverage: true, ...options }),
  'test:lint': lint,
}

module.exports = commands
