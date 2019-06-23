const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')
const ensureTypeScript = require('./typescript')
const ensureGitIgnore = require('./gitignore')

const setup = async projectRoot => {
  const packageManifest = await updatePackageManifest(projectRoot)

  await Promise.all([
    ensureLicense(projectRoot, packageManifest),
    ensureTypeScript(projectRoot),
    ensureGitIgnore(projectRoot),
  ])
}

module.exports = setup
