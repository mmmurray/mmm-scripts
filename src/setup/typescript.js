const { copy } = require('fs-extra')
const { join } = require('path')
const { hasLibOutput } = require('../helpers/config')

const ensureTypeScript = async config => {
  if (config.language !== 'typescript') {
    return
  }

  await copy(
    join(__dirname, '..', 'config', 'tsconfig-default.json'),
    join(config.projectRoot, 'tsconfig.json'),
  )

  if (hasLibOutput(config)) {
    await copy(
      join(__dirname, '..', 'config', 'tsconfig-build.json'),
      join(config.projectRoot, 'tsconfig.build.json'),
    )
  }
}

module.exports = ensureTypeScript
