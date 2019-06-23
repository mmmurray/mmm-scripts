const { readFile } = require('fs-extra')
const { join } = require('path')
const ensureLicense = require('./license')
const updatePackageManifest = require('./package-manifest')
const ensureTypeScript = require('./typescript')
const ensureGitIgnore = require('./gitignore')

const defaultConfig = {
  type: 'library',
  language: 'typescript',
  test: ['eslint', 'jest'],
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
  const fullConfig = {
    ...defaultConfig,
    ...fileConfig,
    ...packageManifest.mmm,
    projectRoot,
  }

  await Promise.all([
    updatePackageManifest(fullConfig, packageManifest),
    ensureLicense(fullConfig, packageManifest),
    ensureTypeScript(fullConfig),
    ensureGitIgnore(fullConfig),
  ])

  return fullConfig
}

module.exports = setup
