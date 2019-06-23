const { copy } = require('fs-extra')
const { join } = require('path')

const ensureTravis = async ({ projectRoot, type }) => {
  const configFile =
    type === 'library' ? 'travis-library.yml' : 'travis-default.yml'

  await copy(
    join(__dirname, '..', 'config', configFile),
    join(projectRoot, '.travis.yml'),
  )
}

module.exports = ensureTravis
