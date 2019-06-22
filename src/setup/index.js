const ensureGitHooks = require('./git-hooks')
const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')
const ensureTypeScript = require('./typescript')

const setup = async projectRoot => {
  const packageManifest = await updatePackageManifest(projectRoot)

  await Promise.all([
    ensureGitHooks(projectRoot),
    ensureLicense(projectRoot, packageManifest),
    ensureTypeScript(projectRoot),
  ])
}

module.exports = setup
