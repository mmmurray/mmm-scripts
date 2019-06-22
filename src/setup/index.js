const { copy } = require('fs-extra')
const { join } = require('path')
const ensureGitHooks = require('./git-hooks')
const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')

const ensureTSConfigFile = projectRoot =>
  copy(
    join(__dirname, '..', '..', 'tsconfig.json'),
    join(projectRoot, 'tsconfig.json'),
  )

const setup = async projectRoot => {
  const packageManifest = await updatePackageManifest(
    join(projectRoot, 'package.json'),
  )

  await Promise.all([
    ensureGitHooks(projectRoot),
    ensureLicense(projectRoot, packageManifest),
    ensureTSConfigFile(projectRoot),
  ])
}

module.exports = setup
