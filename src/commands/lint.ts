import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { getBinPath } from '../helpers/bin-path'
import { spawn } from '../helpers/spawn'
import { Project } from '../types'

const exists = promisify(fs.exists)

const lint = async (project: Project) => {
  const lintDirectories = [
    ...((await exists(join(project.path, 'src'))) ? ['src'] : []),
    ...((await exists(join(project.path, 'test'))) ? ['test'] : []),
  ]

  if (lintDirectories.length === 0) {
    console.log('Skipping eslint since no lintable directories found')
    return
  }

  await spawn(
    getBinPath('eslint'),
    ['--ext', '.ts,.tsx', ...lintDirectories],
    project.path,
  )
}

export { lint }
