import { getBinPath } from '../helpers/bin-path'
import { spawn } from '../helpers/spawn'
import { Project } from '../types'

const compile = async (project: Project) => {
  await spawn(getBinPath('tsc'), ['--noEmit'], project.path)
}

export { compile }
