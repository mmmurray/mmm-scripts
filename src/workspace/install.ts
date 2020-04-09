import fs from 'fs'
import { join, relative } from 'path'
import { promisify } from 'util'
import { formatJSONFile } from '../helpers/file'
import { execProcess } from '../helpers/process'
import { Project } from '../types'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const updateWorkspaces = async (workspaceRoot: string, projects: Project[]) => {
  const newWorkspaces = projects.map((project) =>
    relative(workspaceRoot, project.path),
  )

  const packageManifestPath = join(workspaceRoot, 'package.json')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { workspaces, ...packageManifest } = JSON.parse(
    await readFile(packageManifestPath, 'utf-8'),
  )
  const newPackageManifest = { ...packageManifest, workspaces: newWorkspaces }

  await writeFile(packageManifestPath, formatJSONFile(newPackageManifest))
}

const updateProjectDependencies = async (project: Project) => {
  const packageManifestPath = join(project.path, 'package.json')

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    devDependencies: { 'mmm-scripts': mmmScripts, ...devDependencies } = {
      'mmm-scripts': undefined,
    },
    ...packageManifest
  } = JSON.parse(await readFile(packageManifestPath, 'utf-8'))

  const newPackageManifest = { ...packageManifest, devDependencies }

  await writeFile(packageManifestPath, formatJSONFile(newPackageManifest))
}

const install = async (
  workspaceRoot: string,
  projects: Project[],
): Promise<void> => {
  await updateWorkspaces(workspaceRoot, projects)
  await Promise.all(projects.map(updateProjectDependencies))

  await execProcess('yarn', ['install'], workspaceRoot)
}

export { install }
