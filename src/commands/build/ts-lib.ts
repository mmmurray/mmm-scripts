import { emptyDir } from 'fs-extra'
import { join } from 'path'
import { getBinPath } from '../../helpers/bin-path'
import { spawn } from '../../helpers/spawn'
import { Project, ProjectComponentTSLib } from '../../types'

const buildTSLib = async (
  project: Project,
  component: ProjectComponentTSLib,
) => {
  await emptyDir(join(project.path, component.outputPath))

  await spawn(
    getBinPath('tsc'),
    ['-p', `./tsconfig.${component.name}.json`],
    project.path,
  )
}

export { buildTSLib }
