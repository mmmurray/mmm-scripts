const { copy } = require('fs-extra')
const { join } = require('path')
const ensureGitHooks = require('./git-hooks')
const updatePackageManifest = require('./package-manifest')

const ensureTSConfigFile = projectRoot =>
  copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

const setup = async projectRoot => {
  await Promise.all([
    ensureGitHooks(projectRoot),
    updatePackageManifest(join(projectRoot, 'package.json')),
    ensureTSConfigFile(projectRoot),
  ])
}

module.exports = setup
