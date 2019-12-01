import { getBinPath } from '../helpers/bin-path'
import { spawn } from '../helpers/spawn'
import { Project } from '../types'

const format = async (project: Project) => {
  await spawn(
    getBinPath('prettier'),
    ['--write', '--ignore-path', '.gitignore', '**/*.{md,js,json,ts,tsx}'],
    project.path,
  )
}

export { format }
