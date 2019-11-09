import fs from 'fs'
import { join, relative } from 'path'
import { promisify } from 'util'
import { formatJSONFile } from '../helpers/file'
import { execProcess } from '../helpers/process'
import { Project } from '../types'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const install = async (
  workspaceRoot: string,
  projects: Project[],
): Promise<void> => {
  const newWorkspaces = projects.map(project =>
    relative(workspaceRoot, project.path),
  )
  const packageManifestPath = join(workspaceRoot, 'package.json')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { workspaces, ...packageManifest } = JSON.parse(
    await readFile(packageManifestPath, 'utf-8'),
  )
  const newPackageManifest = { ...packageManifest, workspaces: newWorkspaces }

  await writeFile(packageManifestPath, formatJSONFile(newPackageManifest))

  await execProcess('yarn', ['install'], workspaceRoot)
}

export { install }
