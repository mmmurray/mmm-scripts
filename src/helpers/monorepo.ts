import fs from 'fs'
import { dirname, join } from 'path'
import { promisify } from 'util'
import { loadPackageManifest } from './package-manifest'

const exists = promisify(fs.exists)

const getClosestPackageManifestPath = async (
  currentPath: string,
): Promise<string | null> => {
  if (currentPath === '/') {
    return null
  }

  const packageManifestPath = join(currentPath, 'package.json')

  const packageManifest = (await exists(packageManifestPath))
    ? await loadPackageManifest(packageManifestPath)
    : null

  if (packageManifest && packageManifest.workspaces.length > 0) {
    return packageManifestPath
  }

  return getClosestPackageManifestPath(dirname(currentPath))
}

const getMonorepoRoot = async (projectPath: string): Promise<string | null> => {
  const closestPackageManifestPath = await getClosestPackageManifestPath(
    projectPath,
  )

  return closestPackageManifestPath ? dirname(closestPackageManifestPath) : null
}

export { getMonorepoRoot }
