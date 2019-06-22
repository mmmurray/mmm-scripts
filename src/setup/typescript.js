const { copy } = require('fs-extra')
const { join } = require('path')

const ensureTypeScript = projectRoot =>
  copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

module.exports = ensureTypeScript
