const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')
const ensureTypeScript = require('./typescript')

const setup = async projectRoot => {
  const packageManifest = await updatePackageManifest(projectRoot)

  await Promise.all([
    ensureLicense(projectRoot, packageManifest),
    ensureTypeScript(projectRoot),
  ])
}

module.exports = setup
