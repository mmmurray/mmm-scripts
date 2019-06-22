const { readFile, writeFile } = require('fs-extra')
const { join } = require('path')

const ensureLicense = async (projectRoot, packageManifest) => {
  if (packageManifest.license === 'MIT') {
    const license = await readFile(
      join(__dirname, '..', '..', 'LICENSE'),
      'utf-8',
    )
    const currentYear = String(new Date().getFullYear())
    const dateMatches = license.match(/^Copyright \(c\) (\d\d\d\d)/m)
    const updatedLicense = license.replace(dateMatches[1], currentYear)

    await writeFile(join(projectRoot, 'LICENSE'), updatedLicense)
  }
}

module.exports = ensureLicense
