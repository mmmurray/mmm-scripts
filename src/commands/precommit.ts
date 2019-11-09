import { getBinPath } from '../helpers/bin-path'
import { spawn } from '../helpers/spawn'
import { Project } from '../types'

const precommit = async (project: Project) => {
  await spawn(
    getBinPath('commitlint'),
    ['-E', 'HUSKY_GIT_PARAMS'],
    project.path,
  )
}

export { precommit }
