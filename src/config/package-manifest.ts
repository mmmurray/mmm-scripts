import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { Project } from '../types'
import { Scripts } from './types'

type Options = {
  scripts: Scripts
}

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const packagePropertySortOrder = [
  'name',
  'version',
  'description',
  'author',
  'license',
  'private',
  'workspaces',
  'repository',
  'homepage',
  'keywords',
  'main',
  'types',
  'bin',
  'scripts',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'resolutions',
  'browserslist',
  'mmm',
]

const sortAndFilterProperties = (packageManifest: { [key: string]: any }) =>
  Object.keys(packageManifest)
    .filter((name) => packagePropertySortOrder.includes(name))
    .sort(
      (a, b) =>
        packagePropertySortOrder.indexOf(a) -
        packagePropertySortOrder.indexOf(b),
    )
    .reduce((acc, name) => ({ ...acc, [name]: packageManifest[name] }), {})

const sortObjectKeys = (obj: { [key: string]: any }) =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})

const addDefaultsToPackage = (
  packageManifest: { [key: string]: any },
  scripts: Scripts,
) => ({
  ...packageManifest,
  scripts: sortObjectKeys({ ...scripts, ...packageManifest.scripts }),
  ...(packageManifest.bin ? { bin: sortObjectKeys(packageManifest.bin) } : {}),
  ...(packageManifest.peerDependencies
    ? { peerDependencies: sortObjectKeys(packageManifest.peerDependencies) }
    : {}),
  ...(packageManifest.dependencies
    ? { dependencies: sortObjectKeys(packageManifest.dependencies) }
    : {}),
  ...(packageManifest.devDependencies
    ? { devDependencies: sortObjectKeys(packageManifest.devDependencies) }
    : {}),
  ...(packageManifest.resolutions
    ? { resolutions: sortObjectKeys(packageManifest.resolutions) }
    : {}),
})

const updatePackageManifest = async (project: Project, options: Options) => {
  const packageManifestPath = join(project.path, 'package.json')

  const packageManifest = JSON.parse(
    await readFile(packageManifestPath, 'utf-8'),
  )

  const updatedPackageManifest = sortAndFilterProperties(
    addDefaultsToPackage(packageManifest, options.scripts),
  )

  await writeFile(
    packageManifestPath,
    JSON.stringify(updatedPackageManifest, null, 2) + '\n',
  )
}

export { updatePackageManifest }
