import { Project } from '../types'
import { build } from './build'
import { compile } from './compile'
import { dev } from './dev'
import { lint } from './lint'
import { precommit } from './precommit'
import { release } from './release'
import { test } from './test'

type Commands = {
  [name: string]: ((project: Project) => Promise<void>) | undefined
}

const commands: Commands = {
  init: async () => {
    console.log('Initialised')
  },
  build,
  dev,
  jest: test({ watch: true }),
  precommit,
  release,
  'test:compile': compile,
  'test:coverage': test({ coverage: true }),
  'test:lint': lint,
  test: async project => {
    await compile(project)
    await lint(project)
    await test({ coverage: true })(project)
  },
}

export { commands }
