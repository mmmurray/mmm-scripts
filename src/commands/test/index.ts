import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { Project } from '../../types'
import { createJestConfig } from './config'

const exists = promisify(fs.exists)

type Options = { [name: string]: any }

const createOptionArg = (optionName: string, optionValue: any) =>
  typeof optionValue === 'boolean'
    ? [`--${optionValue ? '' : 'no-'}${optionName}`]
    : [`--${optionName}`, String(optionValue)]

const converOptionsToArgs = (options: Options) =>
  Object.entries(options).reduce<string[]>(
    (acc, [name, value]) => [...acc, ...createOptionArg(name, value)],
    [],
  )

const test = (options: Options) => async (project: Project) => {
  const config = createJestConfig({
    coverageIgnores: project.test.coverageIgnores,
    jestComponentSnapshot: Boolean(
      project.packageManifest.devDependencies['jest-component-snapshot'],
    ),
    testDirectories: [
      ...((await exists(join(project.path, 'test'))) ? ['test'] : []),
    ],
  })

  const optionsArgs = converOptionsToArgs(options)
  const configArgs = ['--config', JSON.stringify(config)]
  const args = [...optionsArgs, ...configArgs, '--passWithNoTests']

  require('jest').run(args)
}

export { test }
