const { copy } = require('fs-extra')
const { join } = require('path')

const ensureTSConfigFile = projectRoot =>
  copy(
    join(__dirname, '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

const setup = async projectRoot => {
  await Promise.all([ensureTSConfigFile(projectRoot)])
}

module.exports = setup
