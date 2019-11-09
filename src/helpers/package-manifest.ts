import fs from 'fs'
import { promisify } from 'util'
import { PackageManifest } from '../types'

const readFile = promisify(fs.readFile)

const loadPackageManifest = async (
  packageManifestPath: string,
): Promise<PackageManifest> => {
  const packageManifest = JSON.parse(
    await readFile(packageManifestPath, 'utf-8'),
  )

  return {
    name: typeof packageManifest.name === 'string' ? packageManifest.name : '',
    workspaces: Array.isArray(packageManifest.workspaces)
      ? packageManifest.workspaces
      : [],
    scripts: packageManifest.scripts || {},
    dependencies: packageManifest.dependencies || {},
    devDependencies: packageManifest.devDependencies || {},
    license: packageManifest.license,
  }
}

export { loadPackageManifest }
