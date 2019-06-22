const { copy } = require('fs-extra')
const { join } = require('path')
const updatePackageManifest = require('./package-manifest')

const ensureTSConfigFile = projectRoot =>
  copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

const setup = async projectRoot => {
  await Promise.all([
    updatePackageManifest(join(projectRoot, 'package.json')),
    ensureTSConfigFile(projectRoot),
  ])
}

module.exports = setup
