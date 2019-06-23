const { copy } = require('fs-extra')
const { join } = require('path')

const ensureTypeScript = async ({ projectRoot, language }) => {
  if (language !== 'typescript') {
    return
  }

  await copy(
    join(__dirname, '..', 'config', 'tsconfig-default.json'),
    join(projectRoot, 'tsconfig.json'),
  )
}

module.exports = ensureTypeScript
