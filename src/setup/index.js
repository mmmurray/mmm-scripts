const { copy } = require('fs-extra')
const { join } = require('path')
const sortPackageProperties = require('./sort-package-properties')

const ensureTSConfigFile = projectRoot =>
  copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

const setup = async projectRoot => {
  await Promise.all([
    sortPackageProperties(join(projectRoot, 'package.json')),
    ensureTSConfigFile(projectRoot),
  ])
}

module.exports = setup
