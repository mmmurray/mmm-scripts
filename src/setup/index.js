const { readFile } = require('fs-extra')
const { join } = require('path')
const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')
const ensureTravis = require('./travis')
const ensureTypeScript = require('./typescript')
const ensureGitIgnore = require('./gitignore')

const defaultConfig = {
  type: 'library',
  language: 'typescript',
  test: ['eslint', 'jest'],
  transformJestConfig: x => x,
}

const loadConfig = projectRoot => {
  try {
    return require(join(projectRoot, 'mmm.config.js')) || {}
  } catch {
    return {}
  }
}

const loadPackageManifest = async projectRoot => {
  const packagePath = join(projectRoot, 'package.json')
  const packageManifest = JSON.parse(await readFile(packagePath, 'utf-8'))

  return packageManifest
}

const setup = async projectRoot => {
  const packageManifest = await loadPackageManifest(projectRoot)

  const fileConfig = loadConfig(projectRoot)
  const config = {
    ...defaultConfig,
    ...fileConfig,
    ...packageManifest.mmm,
    projectRoot,
  }

  await Promise.all([
    updatePackageManifest(config, packageManifest),
    ensureLicense(config, packageManifest),
    ensureTravis(config),
    ensureTypeScript(config),
    ensureGitIgnore(config),
  ])

  return config
}

module.exports = setup
