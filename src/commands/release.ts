import { getBinPath } from '../helpers/bin-path'
import { spawn } from '../helpers/spawn'
import { Project } from '../types'

const release = async (project: Project) => {
  await spawn(getBinPath('semantic-release'), [], project.path, {
    GH_TOKEN: process.env.GH_TOKEN || process.env.INPUT_GH_TOKEN || '',
    NPM_TOKEN: process.env.NPM_TOKEN || process.env.INPUT_NPM_TOKEN || '',
  })
}

export { release }
